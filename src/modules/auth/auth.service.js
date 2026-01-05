import User from "../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.util.js";
import { comparePassword, hashPassword } from "../../utils/password.util.js";
import { isValidEmail, strongPassword } from "../../utils/validation.util.js";
import { generateOTP, saveOtp, verifyOTP } from "./otp.service.js";

/* -------------------------------------------------------------------------- */
/*                               HELPER METHODS                               */
/* -------------------------------------------------------------------------- */

const sendOTP = async (userId, purpose = "AUTH") => {
  const otp = generateOTP();
  await saveOtp(userId, otp);

  // 🔔 Replace with Email/SMS service
  console.log(`${purpose} OTP:`, otp);
};

const getUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({ email });
  if (includePassword) query.select("+password");
  return query;
};

/* -------------------------------------------------------------------------- */
/*                              REGISTER FLOW                                 */
/* -------------------------------------------------------------------------- */

export const registerUser = async (data) => {
  const email = data.email?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (data.password && !strongPassword(data.password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    ...data,
    email,
    password: await hashPassword(data.password),
    isVerified: false,
  });

  const otp = generateOTP();
  await saveOtp(user._id, otp);

  console.log("REGISTER OTP:", otp);

  return {
    userId: user._id,
    message: "Registration successful. Please verify OTP.",
  };
};

export const verifyRegisterOTP = async (userId, otp) => {
  const isValid = await verifyOTP(userId, otp);
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  await User.findByIdAndUpdate(userId, { isVerified: true });

  return {
    message: "Account verified successfully",
  };
};

/* -------------------------------------------------------------------------- */
/*                                LOGIN FLOW                                  */
/* -------------------------------------------------------------------------- */

export const loginUser = async (email, password) => {
  const user = await getUserByEmail(email, true);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new Error("Account not verified");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  await sendOTP(user._id, "LOGIN");

  return {
    userId: user._id,
    message: "OTP sent for login verification",
  };
};

export const verifyLoginOTP = async (userId, otp) => {
  const isValid = await verifyOTP(userId, otp);
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    role: user.role,
  };
};

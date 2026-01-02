import User from "../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.util.js";
import { comparePassword, hashPassword } from "../../utils/password.util.js";
import { generateOTP, saveOtp, verifyOTP } from "./otp.service.js";

export const registerUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");
  const user = await User.create({
    ...data,
    password: await hashPassword(data.password),
  });
  const otp = generateOTP();
  await saveOtp(user._id, otp);

  console.log("REGISTER OTP:", otp); // 🔔 Replace with SMS/Email

  return { userId: user._id };
};

export const verifyRegisterOTP = async (userId, otp) => {
  const isValid = await verifyOTP(userId, otp);

  if (!isValid) throw new Error("Invalid or expired OTP");

  await User.findByIdAndUpdate(userId, { isVerified: true });

  return { message: "Account verified successfully" };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  if (!user.isVerified) throw new Error("Account not verified");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const otp = generateOTP();
  await saveOtp(user._id, otp);

  console.log("LOGIN OTP:", otp);

  return { userId: user._id };
};

export const verifyLoginOTP = async (userId, otp) => {
  const valid = await verifyOTP(userId, otp);
  if (!valid) throw new Error("Invalid OTP");

  const user = await User.findById(userId);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, role: user.role };
};

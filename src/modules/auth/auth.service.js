import User from "../../models/user.model.js";
import { sendOTPEmail, sendWelcomeEmail } from "../../services/email.service.js";
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

const sendOTP = async (userId, email, purpose = "AUTH") => {
  const otp = generateOTP();
  await saveOtp(userId, otp);
  
  // Send OTP via email
  try {
    await sendOTPEmail(email, otp, purpose);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    // You can choose to throw error or continue (for development)
    // For production, you might want to throw the error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send OTP. Please try again later.');
    } else {
      console.log(`${purpose} OTP (fallback):`, otp);
    }
  }
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

  // Send OTP via email
  await sendOTP(user._id, email, "REGISTER");

  return {
    userId: user._id,
    message: "Registration successful. Please check your email for OTP.",
  };
};

export const verifyRegisterOTP = async (userId, otp) => {
  const isValid = await verifyOTP(userId, otp);
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  const user = await User.findByIdAndUpdate(
    userId, 
    { isVerified: true },
    { new: true }
  );

  // Send welcome email after successful verification
  if (user) {
    await sendWelcomeEmail(user.email, user.name || user.email);
  }

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

  await sendOTP(user._id, email, "LOGIN");

  return {
    userId: user._id,
    message: "OTP sent to your email for login verification",
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

// Add password reset functionality
export const requestPasswordReset = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  await sendOTP(user._id, email, "RESET_PASSWORD");

  return {
    userId: user._id,
    message: "Password reset OTP sent to your email",
  };
};

export const resetPassword = async (userId, otp, newPassword) => {
  const isValid = await verifyOTP(userId, otp);
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  if (!strongPassword(newPassword)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return {
    message: "Password reset successful",
  };
};
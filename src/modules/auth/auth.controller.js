import * as AuthService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const data = await AuthService.registerUser(req.body);
    console.log("data", data);
    res.status(201).json({ message: "OTP sent", ...data });
  } catch (error) {
    next(error);
  }
};

export const verifyRegisterOtp = async (req, res, next) => {
  try {
    const data = await AuthService.verifyRegisterOTP(
      req.body.userId,
      req.body.otp
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await AuthService.loginUser(req.body.email, req.body.password);
    res.status(200).json({ message: "OTP sent", ...data });
  } catch (err) {
    next(err);
  }
};

export const verifyLoginOtp = async (req, res, next) => {
  try {
    const data = await AuthService.verifyLoginOTP(
      req.body.userId,
      req.body.otp
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

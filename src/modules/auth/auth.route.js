import express from "express";
import {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/register/verify-otp", verifyRegisterOtp);

router.post("/login", login);
router.post("/login/verify-otp", verifyLoginOtp);

export default router;

import OTP from "../../models/otp.model.js";

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const saveOtp = async (userId, otp) => {
    await OTP.deleteMany({userId});

    return await OTP.create({
        userId,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
    });
}

export const verifyOTP = async (userId, otp) => {
  const record = await OTP.findOne({ userId, otp });
  if (!record) return false;

  await OTP.deleteMany({ userId });
  return true;
};
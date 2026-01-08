import nodemailer from "nodemailer";
import { emailConfig } from "../config/email.config.js";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "mhatreraj1828@gmail.com",
    pass: "kgofnsvygbcqoemf",
  },
});

/**
 * ✅ Reusable Mail Sender
 */
export const sendMail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `"QueueLess" <${emailConfig.auth.user}>`,
      to,
      subject,
      html,
      text,
    });

    // console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Email sending failed");
  }
};

export const sendOTPEmail = async (email, otp, purpose = "REGISTER") => {
  let subject, html;

  switch (purpose) {
    case "REGISTER":
      subject = "Verify Your Account - Registration OTP";
      html = `
        <h2>Welcome!</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `;
      break;

    case "LOGIN":
      subject = "Login Verification OTP";
      html = `
        <h2>Login Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `;
      break;

    default:
      subject = "Your Verification OTP";
      html = `<h1>${otp}</h1>`;
  }

  return sendMail({
    to: email,
    subject,
    html,
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  return sendMail({
    to: email,
    subject: "Welcome to Our Platform!",
    html: `
      <h2>Welcome, ${name} 🎉</h2>
      <p>Your account is now active.</p>
    `,
    text: `Welcome ${name}, your account is now active.`,
  });
};

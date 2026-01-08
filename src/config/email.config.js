export const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "mhatreraj1828@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password", // Use App Password, not regular password
  },
};


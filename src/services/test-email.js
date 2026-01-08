import { sendOTPEmail } from "./email.service.js";

const testEmail = async () => {
  try {
    const result = await sendOTPEmail(
      "letsmail.m.raj@gmail.com",
      "123456",
      "REGISTER"
    );

    if (result) {
      console.log("✅ Test email sent successfully!");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    // Optional: exit process if this is a standalone script
    process.exit(0);
  }
};

testEmail();

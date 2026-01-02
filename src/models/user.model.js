import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    select: false,
  },

  role: {
    type: String,
    enum: ["SUPER_ADMIN", "BUSINESS", "USER"],
    default: "USER",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  refreshToken: String,

}, { timestamps: true });

export default mongoose.model("User", userSchema);

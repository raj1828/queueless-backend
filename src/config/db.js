import mongoose from "mongoose";
import dotenv from "dotenv";
import env from "./env.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("DB connect sussceefully");
  } catch (error) {
    console.log("Error in connecting db", error);
  }
};

export default connectDB;

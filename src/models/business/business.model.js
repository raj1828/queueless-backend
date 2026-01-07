import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    basicDetails: {
      name: {
        type: String,
        required: true
      },
      description: String,
      phone: String,
      email: String,
      website: String
    },

    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      lat: Number,
      lng: Number
    },

    category: String,

    operatingHours: {
      open: String,   // "09:00"
      close: String   // "18:00"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    subscription: {
      plan: String,
      expiresAt: Date,
      tokenLimit: Number
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Business", businessSchema);

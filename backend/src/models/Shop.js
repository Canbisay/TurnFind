import mongoose from "mongoose";
import { DEFAULT_TIMEZONE } from "../config/constants.js";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: { type: String, required: true, trim: true }, // used for the "call shop" button
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    // GeoJSON point for "shops near me" later
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
    timezone: { type: String, default: DEFAULT_TIMEZONE },
    avgServiceMin: { type: Number, default: 20, min: 5, max: 240 }, // default time per customer
    autoRemoveLate: { type: Boolean, default: true }, // owner can switch off
    lateGraceMin: { type: Number, default: 15, min: 1, max: 240 }, // wait after turn is called
    chairs: { type: Number, default: 1, min: 1, max: 50 }, // barbers working at once
    isOpen: { type: Boolean, default: true }, // owner can pause the queue
  },
  { timestamps: true },
);

shopSchema.index({ location: "2dsphere" }, { sparse: true });
shopSchema.index({ city: 1 });

export default mongoose.model("Shop", shopSchema);

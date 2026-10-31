import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    durationMin: { type: Number, required: true, min: 5, max: 240 },
    price: { type: Number, required: true, min: 0 }, // in paise (Rs 150 = 15000)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

serviceSchema.index({ shop: 1, isActive: 1 });

export default mongoose.model("Service", serviceSchema);

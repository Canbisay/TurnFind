import mongoose from "mongoose";

// One document per shop per day. Gives the next token number.
// New day = new document = token starts from 1 again.
const counterSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },

  dateKey: {
    type: String,
    required: true,
  },

  seq: {
    type: Number,
    default: 0,
  },
});

counterSchema.index({ shop: 1, dateKey: 1 }, { unique: true });

export default mongoose.model("Counter", counterSchema);

import mongoose from "mongoose";

// APPEND-ONLY ledger. Once saved, a payment is never edited or deleted.
// A refund is a NEW document with type "refund" pointing to the original.
const paymentSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["payment", "refund"], default: "payment" },
    refundOf: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },

    amount: { type: Number, required: true, min: 1 }, // paise, always a whole number
    currency: { type: String, default: "INR" },
    method: {
      type: String,
      enum: ["online", "cash", "upi_counter"],
      required: true,
    },

    // Razorpay details (empty for cash)
    gateway: { type: String, enum: ["razorpay"] },
    gatewayOrderId: { type: String },
    gatewayPaymentId: { type: String, unique: true, sparse: true }, // blocks duplicates

    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff who took cash
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const blocked = () => {
  throw new Error("Payments are permanent and cannot be changed or deleted");
};

// Block every update/delete style operation
[
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "findOneAndReplace",
  "findOneAndDelete",
  "replaceOne",
  "deleteMany",
].forEach((op) => paymentSchema.pre(op, blocked));

paymentSchema.pre("deleteOne", { document: true, query: true }, blocked);

// save() is allowed only for brand new documents
paymentSchema.pre("save", function () {
  if (!this.isNew) blocked();
});

paymentSchema.index({ shop: 1, createdAt: -1 });
paymentSchema.index({ customer: 1, createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);

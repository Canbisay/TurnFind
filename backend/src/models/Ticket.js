import mongoose from "mongoose";
import { TICKET_STATUS, ACTIVE_STATUSES } from "../config/constants.js";

const ticketSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    // Empty for walk-in customers who have no account
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    walkInName: { type: String, trim: true, maxlength: 60 },
    walkInPhone: { type: String, trim: true },

    tokenNumber: { type: Number, required: true },
    dateKey: { type: String, required: true },

    source: { type: String, enum: ["online", "walkin"], required: true },
    priority: { type: String, enum: ["normal", "high"], default: "normal" },

    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    // Saved at join time so later price/duration changes do not alter old tickets
    durationMin: { type: Number, required: true, min: 5 },
    totalPrice: { type: Number, required: true, min: 0 }, // paise

    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.WAITING,
    },
    checkedIn: { type: Boolean, default: false }, // online customer reached the shop
    joinedAt: { type: Date, default: Date.now },
    durationMin: { type: Number, required: true, min: 5 }, // shop default, or sum of chosen services
    extraMin: { type: Number, default: 0, min: 0, max: 240 }, // owner adds time to current customer

    // Set when the ticket is called: calledAt + shop.lateGraceMin.
    // Stays empty if the owner turned auto-remove off.
    expiresAt: { type: Date },

    endedBy: { type: String, enum: ["customer", "staff", "system"] },
    endNote: { type: String, trim: true, maxlength: 200 }, // e.g. "paid cash", "left early"
    calledAt: Date,
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true },
);

// A token number is unique per shop per day
ticketSchema.index({ shop: 1, dateKey: 1, tokenNumber: 1 }, { unique: true });

// Fast queue read: waiting tickets in order
ticketSchema.index({ shop: 1, status: 1, priority: -1, joinedAt: 1 });

// Used by the expiry cron job
ticketSchema.index({ status: 1, expiresAt: 1 });

// Stops double submit: one active ticket per customer per shop
ticketSchema.index(
  { customer: 1, shop: 1 },
  {
    unique: true,
    partialFilterExpression: {
      customer: { $exists: true },
      status: { $in: ACTIVE_STATUSES },
    },
  },
);

export default mongoose.model("Ticket", ticketSchema);

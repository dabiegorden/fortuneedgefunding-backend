import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USDT",
    },
    status: {
      type: String,
      enum: ["pending", "confirming", "confirmed", "sending", "partially_paid", "finished", "failed", "refunded"],
      default: "pending",
    },
    paymentUrl: String,
    ipnCallbacks: [
      {
        timestamp: Date,
        status: String,
        data: Object,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Payment = mongoose.model("Payment", PaymentSchema)

export default Payment


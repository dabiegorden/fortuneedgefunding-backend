import mongoose from "mongoose"

const ChallengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["1step", "instant"],
      required: true,
    },
    category: {
      type: String,
      enum: ["synthetic", "forex"],
      required: true,
    },
    accountSize: {
      type: String,
      enum: ["$5K", "$10K", "$25K", "$50K", "$100K", "$200K"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    platform: {
      type: String,
      enum: ["mt4", "mt5"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "active", "completed", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    tradingCredentials: {
      login: String,
      password: String,
      server: String,
      sentAt: Date,
    },
    metrics: {
      balance: {
        type: Number,
        default: 0,
      },
      equity: {
        type: Number,
        default: 0,
      },
      drawdown: {
        type: Number,
        default: 0,
      },
      profit: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
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

const Challenge = mongoose.model("Challenge", ChallengeSchema)

export default Challenge


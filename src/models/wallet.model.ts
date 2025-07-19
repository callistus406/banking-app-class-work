import mongoose, { Schema, Types } from "mongoose";
import { userModel } from "./user.model";


// console.log(userModel.name);

const walletSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      ref: userModel.name,
    },
    account_number: { type: String, required: true, unique: true },
    balance: { type: Types.Decimal128, default: 0 },
    status: { type: String, enum: ["FROZEN","ACTIVE", "INACTIVE"],default:"ACTIVE"},
    transaction_pin: { type: String },
  },
  {
    timestamps: true,
  }
);

export const walletModel = mongoose.model("Wallet", walletSchema);

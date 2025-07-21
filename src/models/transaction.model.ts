import Mongoose, { Schema } from "mongoose";

const enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
const Transactionschema = new Schema(
  {
    amount: { type: Number, required: true },
    sendersAccount: { type: String, required: true },
    receiversAccount: { type: String, required: true },
    tx_ref: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: TransactionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const transactionModel = Mongoose.model(
  "Transaction",
  Transactionschema
);

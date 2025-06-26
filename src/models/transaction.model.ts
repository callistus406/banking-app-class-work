import Mongoose , { Schema } from "mongoose";

const Transactionschema = new Schema({
  id: {type: String, required: true, unique: true},
  amount: {type: Number, required: true},
  sender: {type: String, required: true},
  receiver: {type: String, required: true},
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  timestamp: {type: Date, default: Date.now},
});

export const transactionModel = Mongoose.model("Transaction", Transactionschema);
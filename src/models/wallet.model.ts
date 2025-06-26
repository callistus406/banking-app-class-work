import mongoose, {Schema} from "mongoose";

const walletSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  Acc_numId: { type: String, required: true, unique: true },
  walletName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "NIG" },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

export const WalletModel = mongoose.model("Wallet", walletSchema);

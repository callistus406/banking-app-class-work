import mongoose, {Schema} from "mongoose";

const HistorySchema = new Schema({
  userId: {type: String, required: true},
  transferId: {type: String, required: true},
  action: {type: String, required: true},
  timestamp: {type: Date, default: Date.now},
});

export const HistoryModel = mongoose.model("History", HistorySchema);
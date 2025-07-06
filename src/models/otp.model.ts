import { object } from "joi";
import mongoose , {Schema, Types} from "mongoose";

const OTPSchema = new Schema({
  userId: {type: Types.ObjectId, },
  email: {type: String, required: true},
  otp: {type: String, required: true},
  createdAt: {type: Date, default: Date.now, expires: "1hr"},
});

export const OTPModel = mongoose.model("Otp", OTPSchema);



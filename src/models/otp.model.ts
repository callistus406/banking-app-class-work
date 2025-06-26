import { object } from "joi";
import mongoose , {Schema} from "mongoose";

const OTPSchema = new Schema({
  userId: {type: object(), },
  email: {type: String, required: true},
  otp: {type: String, required: true},
  createdAt: {type: Date, default: Date.now, expires: "1hr"},
});

export const OTPModel = mongoose.model("Otp", OTPSchema);
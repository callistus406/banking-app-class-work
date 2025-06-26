import { object } from "joi";
import mongoose , {Schema} from "mongoose";

const OTPSchema = new Schema({
  userId: {type: object(), required: true},
  email: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  otp: {type: String, required: true},
  createdAt: {type: Date, default: Date.now, expires: "5m"},
});

export const OTPModel = mongoose.model("OTP", OTPSchema);
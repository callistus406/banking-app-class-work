import { Types } from "mongoose";

export interface ICreateWallet {
  userId: Types.ObjectId;
  acccountNumber: string;
}

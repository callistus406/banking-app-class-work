import { Types } from "mongoose";
import { ICreateWallet } from "../@types/wallet";
import { walletModel } from "../models/wallet.model";
import { userModel } from "../models/user.model";

export class WalletRepository {
  static async createWallet(wallet: ICreateWallet) {
    const response = await walletModel.create({
      user_id: wallet.userId,
      account_number: wallet.acccountNumber,
    });

    return response;
  }

  static async findAccountNumber(accountNumber: string) {
    const response = await walletModel
      .findOne({
        account_number: accountNumber,
      })
      .populate({
        path: "user_id",
        model: "User",
      });
    if (!response) return null;

    return response;
  }

  static async updatePin(userId: Types.ObjectId, pin: string) {
    const response = await walletModel.findOneAndUpdate(
      { user_id: userId },
      {
        transaction_pin: pin,
      }
    );
    if (!response) return null;

    return response;
  }

  static async getWallets() {
    const response = await walletModel
      .find()
      .select("account_number")
      .populate({
        path: "user_id",
        model: "User",
      });

    const mapped = response.map((item) => {
      return {
        accountNumber: item.account_number,
        name: `${(item.user_id as any).first_name} ${
          (item.user_id as any).first_name
        }`,
        status: item.status
      };
    });
    return mapped;
  }
}

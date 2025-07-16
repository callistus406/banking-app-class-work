import { Types } from "mongoose";
import { WalletRepository } from "../repository/wallet.repository";
import { validatePin } from "../validation/wallet.validator";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import bcrypt from "bcrypt";
export class WalletService {
  static getWallet(userId: Types.ObjectId) {}

  static transfer(userId: Types.ObjectId) {}

  static async getWalletByAccountNumber(accountNumber: string) {
    const res = await WalletRepository.findAccountNumber(accountNumber);
    if (!res) return null;
    return {
      accountNumber: res?.account_number,
      balance: res.balance,
      status: res.status,
      name: `${(res.user_id as any).first_name} ${
        (res.user_id as any).first_name
      }`,
    };
  }

  static async getwallets() {
    const response = await WalletRepository.getWallets();

    return response;
  }

  static async updateWalletPin(
    userId: Types.ObjectId,
    data: { pin: string; confirmPin: string }
  ) {
    const { error } = validatePin.validate(data);
    if (error) throw throwCustomError(error.message, 422);

    if (data.pin !== data.confirmPin)
      throw throwCustomError("Pin does not match", 400);

    const hashedPin = await bcrypt.hash(data.confirmPin, 5);
    //validate the pin

    // hash the pin
    const res = await WalletRepository.updatePin(userId, hashedPin);
    if (!res) throw throwCustomError("Something went wrong", 500);

    return "Transaction updated!";
  }
}

import { ICreateWallet } from "../@types/wallet";
import { walletModel } from "../models/wallet.model";

export class WalletRepository {
  static async createWallet(wallet: ICreateWallet) {
    const response = await walletModel.create({
      user_id: wallet.userId,
      account_number: wallet.acccountNumber,
    });

    return response;
  }

  static async findAccountNumber(accountNumber: string) {
    const response = await walletModel.findOne({
      account_number: accountNumber,
    });
    if (!response) return null;

    return response;
  }
}

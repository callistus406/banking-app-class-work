import { Types } from "mongoose";
import { ICreateWallet } from "../@types/wallet";
import { walletModel } from "../models/wallet.model";
import { userModel } from "../models/user.model";
import { transactionModel } from "../models/transaction.model";

export class WalletRepository {
  static async createWallet(wallet: ICreateWallet) {
    const response = await walletModel.create({
      user_id: wallet.userId,
      account_number: wallet.acccountNumber,
    });

    return response;
  }

  static async getwalletByUserId(userId: Types.ObjectId) {
    const response = await walletModel.findOne({user_id: userId})
    if (!response) return null;

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
    // Map the response to return only necessary fields
    return {
      account_number: response.account_number,
      Accountname: `${(response.user_id as any).first_name} ${(response.user_id as any).last_name}`,
      balance: response.balance,
      status: response.status,
      user_id: response.user_id,
    };
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
 static async debitAccount(acccountNumber:string, accountId: Types.ObjectId, amount: number){

  const response = await walletModel.findOneAndUpdate(
    { account_number: acccountNumber },   
    { $inc: { balance: -amount } },
    { new: true }
  );
    if (!response) return null;

    return response;
  }
  

  static async creditAccount(acccountNumber:string, accountId: Types.ObjectId, amount: number){

    const response = await walletModel.findOneAndUpdate(
      { account_number: acccountNumber },
      { $inc: { balance: amount } },
      { new: true }
    );
    if (!response) return null;

    return response;
  } 


static async createWalletTransactionHistory(data: {
  wallet_id: Types.ObjectId;
  senders_account: string;
  recievers_account: string;
  tx_ref: string;
  amount: number;
  type: 'credit' | 'debit';
  status?: 'pending' | 'success' | 'failed';
}) {
  const transaction = await transactionModel.create({
    ...data,
    status: data.status || 'success',
  });

  return transaction;
}


  
}

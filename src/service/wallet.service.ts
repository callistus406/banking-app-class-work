import { Types } from "mongoose";
import { WalletRepository } from "../repository/wallet.repository";
import { transferValidator, validatePin } from "../validation/wallet.validator";
import { throwCustomError } from "../middleware/errorHandler.midleware";

import mongoose from "mongoose";

import bcrypt from "bcrypt";
import { send } from "process";
import { walletModel } from "../models/wallet.model";
import { sendMail } from "../until/nodemailer";
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

    if (isNaN(parseInt(data.pin)) || isNaN(parseInt(data.confirmPin)))
      throw throwCustomError("Pin must be a number", 400);

    if (data.pin !== data.confirmPin)
      throw throwCustomError("Pin does not match", 400);

    if (data.pin.length < 4 || data.confirmPin.length < 4)
      throw throwCustomError("Pin must be 4 digits", 400);
    // hash the pin

    const hashedPin = await bcrypt.hash(data.confirmPin, 5);
    //validate the pin

    // hash the pin
    const res = await WalletRepository.updatePin(userId, hashedPin);
    if (!res) throw throwCustomError("Something went wrong", 500);

    return "Transaction pin updated!";
  }

  static async transferMoney(
    userId: Types.ObjectId,
    data: {
      accountNumber: string;
      amount: number;
      pin: string;
      description: string;
    }
  ) {
    //create transaction

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      // Logic to debit the account
      const senderwallet = await WalletRepository.getwalletByUserId(userId);
      if (!senderwallet)
        throw throwCustomError("Account number does not exist", 404);

      const { error } = transferValidator.validate(data);
      if (error) throw throwCustomError(error.message, 422);

      // validate the pin

      //check if account number exists

      const isValid = await WalletRepository.findAccountNumber(
        data.accountNumber
      );
      if (!isValid)
        throw throwCustomError("Account number does not exist", 404);

      // check pin match
      if (!senderwallet.transaction_pin)
        throw throwCustomError("Transaction pin not set", 400);
      // check pin match
      if (!senderwallet.transaction_pin)
        throw throwCustomError("Transaction pin not set", 400);

      const isInvalidPin = await bcrypt.compare(
        data.pin,
        senderwallet.transaction_pin
      );
      if (!isInvalidPin) throw throwCustomError("Invalid transaction pin", 400);

      if (senderwallet.account_number === data.accountNumber)
        throw throwCustomError(
          "You cannot transfer money to your own account",
          400
        );
      if (senderwallet.account_number === data.accountNumber)
        throw throwCustomError(
          "You cannot transfer money to your own account",
          400
        );

      //convert senderwallet balance to number
      const walletBalance = parseFloat(senderwallet.balance.toString());
      // check if amount is a number
      if (isNaN(data.amount))
        throw throwCustomError("Amount must be a number", 400);
      // check if amount is less than or equal to 0
      if (data.amount <= 0)
        throw throwCustomError("Amount must be greater than 0", 400);
      // check if amount is greater than balance
      if (data.amount > walletBalance)
        throw throwCustomError("Insufficient balance", 400);

      // debit the sender's account (with transaction)
      const debit = await WalletRepository.debitAccount(
        senderwallet.account_number,
        userId,
        data.amount,
        session
      );
      if (!debit)
        throw throwCustomError(
          "Something went wrong while debiting the account",
          500
        );

      //(with transaction)
      const credit = await WalletRepository.creditAccount(
        data.accountNumber,
        userId,
        data.amount,
        session
      );

      const tx_ref = `Ref-${Date.now()}`;
      const tx_ref2 = `Ref-${Date.now()}+1`;

      if (!credit)
        throw throwCustomError(
          "Something went wrong while crediting the account",
          500
        );
      await WalletRepository.createWalletTransactionHistory(
        {
          walletId: senderwallet._id,
          sendersAccount: senderwallet.account_number,
          recieversAccount: isValid.account_number,
          status: "COMPLETED",
          tx_ref,
          amount: data.amount,
          type: "DEBIT",
        },
        session
      );

      // sendMail(
      //   {
      //     email: (senderwallet.user_id as any).email,
      //     subject: "WALLET CONFIRMATION",
      //     emailInfo: {
      //       customerName: `${user.last_name} ${user.first_name}`,
      //       accountName: `${user.last_name} ${user.first_name}`,
      //       accountNumber: accountNumber,
      //       name: `${user.last_name} ${user.first_name}`,
      //     },
      //   },
      //   accountInfoTemplate
      // );

      await WalletRepository.createWalletTransactionHistory(
        {
          walletId: isValid._id,
          sendersAccount: senderwallet.account_number,
          recieversAccount: isValid.account_number,
          status: "COMPLETED",
          tx_ref: tx_ref2,
          amount: data.amount,
          type: "CREDIT",
        },
        session
      );

      session.commitTransaction();
      return {
        success: true,
        message: "Transfer successful",
        payload: {
          transactionId: debit._id,
          accountNumber: debit.account_number,
          accountName: isValid.Accountname,
          creditAccountNumber: data.accountNumber,
          amount: data.amount,
          description: data.description,
        },
      };
    } catch (error: any) {
      session.abortTransaction();
      session.endSession();
      throw throwCustomError(error.message, 500);
    }
  }

  static async debitAccount(data: {
    acccountNumber: string;
    amount: number;
    pin: string;
  }) {
    // Logic to debit the account
  }

  // static async createTransactionHistory(data: {
  //   wallet_id: Types.ObjectId;
  //   senders_account: string;
  //   recievers_account: string;
  //   tx_ref: string;
  //   amount: number;
  //   type: "credit" | "debit";
  //   status?: "pending" | "success" | "failed";
  // }) {
  //   const response = await WalletRepository.createWalletTransactionHistory(
  //     data
  //   );
  // static async createTransactionHistory(data: {
  //   wallet_id: Types.ObjectId;
  //   senders_account: string;
  //   recievers_account: string;
  //   tx_ref: string;
  //   amount: number;
  //   type: "credit" | "debit";
  //   status?: "pending" | "success" | "failed";
  // }) {
  //   const response = await WalletRepository.createWalletTransactionHistory(
  //     data
  //   );

  //   if (!response) {
  //     throw throwCustomError("Failed to create transaction history", 500);
  //   }
  //   if (!response) {
  //     throw throwCustomError("Failed to create transaction history", 500);
  //   }

  //   return {
  //     senders_account: response.sendersAccount,
  //     receivers_account: response.receiversAccount,
  //     amount: response.amount,
  //     status: response.status,
  //     tx_ref: response.tx_ref,
  //     type: response.status,
  //     createdAt: response.createdAt,
  //   };
  // }
  //   return {
  //     senders_account: response.sendersAccount,
  //     receivers_account: response.receiversAccount,
  //     amount: response.amount,
  //     status: response.status,
  //     tx_ref: response.tx_ref,
  //     type: response.status,
  //     createdAt: response.createdAt,
  //   };
  // }
}

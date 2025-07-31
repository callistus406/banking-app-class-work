import { Types } from "mongoose";
import { WalletRepository } from "../repository/wallet.repository";
import { transferValidator, validatePin } from "../validation/wallet.validator";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import { sendMail } from "../until/nodemailer";
import generateTransactionEmail from "../until/transaction-template";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { send } from "process";
import { any } from "joi";
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


    const obj = {} as {
      name: string;
      transaction_id: string;
      transaction_amount: number;
      transaction_date: string;
      payment_method: string;
      transaction_status: "Success" | "Failed";
      year: any;
    };
    const senderwallet = await WalletRepository.getwalletByUserId(userId);
    if (!senderwallet)
      throw throwCustomError("Account number does not exist", 404);
    try {
      // Logic to debit the account (with transaction)

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

      // debit the sender's account  (with transaction)
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

      // (with transaction)

      const credit = await WalletRepository.creditAccount(
        data.accountNumber,
        userId,
        data.amount,
        session
      );
      if (!credit)
        throw throwCustomError(
          "Something went wrong while crediting the account",
          500
        );

      const tx_ref = `Ref-${Date.now()}`;
      const tx_ref2 = `Ref-${Date.now()}1`;

      // create transaction history for debit
      const transaction1 =
        await WalletRepository.createWalletTransactionHistory(
          {
            walletId: senderwallet._id,
            sendersAccount: senderwallet.account_number,
            recieversAccount: data.accountNumber,
            tx_ref,
            amount: data.amount,
            type: "DEBIT",
            status: "COMPLETED",
            userId: senderwallet._id,
          },
          session
        );

      //sendmail to sender

      // create transaction history for credit
      const transaction2 =
        await WalletRepository.createWalletTransactionHistory(
          {
            walletId: isValid._id,
            sendersAccount: senderwallet.account_number,
            recieversAccount: isValid.account_number,
            tx_ref: tx_ref2,
            amount: data.amount,
            type: "CREDIT",
            status: "COMPLETED",
            userId: isValid._id,
          },
          session
        );

      session.commitTransaction();
      //=====================||RECEIVER NOTIFICATION ||================

      sendMail(
        {
          email: isValid.email,
          subject: "[CREDIT]Transaction Notification",
          emailInfo: {
            name: isValid.Accountname,
            transaction_id: tx_ref2,
            transaction_amount: data.amount,
            transaction_date: new Date(transaction2.createdAt).toUTCString(),
            payment_method: "TRANSFER",
            transaction_status: "success",
            year: new Date().getFullYear(),
          },
        },
        generateTransactionEmail
      );

      //=====================||SENDER NOTIFICATION ||================
      sendMail(
        {
          email: (senderwallet.user_id as any).email,
          subject: "[DEBIT]Transaction Notification",
          emailInfo: {
            name: `${(senderwallet.user_id as any).last_name} ${
              (senderwallet.user_id as any).first_name
            }`,

            transaction_id: tx_ref,
            transaction_amount: data.amount,
            transaction_date: new Date(transaction1.createdAt).toISOString(),
            payment_method: "TRANSFER",
            transaction_status: "success",
            year: new Date().getFullYear(),
          },
        },
        generateTransactionEmail
      );
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
      await session.abortTransaction();
      
      // //=====================||SENDER NOTIFICATION FAILURE ||================
      const tx_ref3 = `Ref-${Date.now()}3`;
      
      const transaction3 =
      await WalletRepository.createWalletTransactionHistory(
        {
          walletId: senderwallet._id,
          sendersAccount: senderwallet.account_number,
          recieversAccount: data.accountNumber,
          tx_ref: tx_ref3,
          amount: data.amount,
          type: "DEBIT",
          status: "FAILED",
          userId: senderwallet._id,
        },
        session
      );
      sendMail(
        {
          email: (senderwallet.user_id as any).email,
          subject: "Transaction Notification",
          emailInfo: {
            name: `${(senderwallet.user_id as any).last_name} ${(senderwallet.user_id as any).first_name}`,
            transaction_id: tx_ref3,
            transaction_amount: data.amount,
            transaction_date: new Date(transaction3.createdAt).toISOString(),
            payment_method: "TRANSFER",
            transaction_status: "Failed",
            year: new Date().getFullYear(),
          },
          
        },
        generateTransactionEmail
      );
      session.endSession();
      throw throwCustomError(error.message || "Transaction failed", 500);
    } finally {
    }
  }

  static async createTransactionHistory(
    filter: {
      page: string;
      limit: string;
      search: string;
    },
    id: Types.ObjectId
  ) {
    const page = parseInt(filter.page) || 1;
    const limit = parseInt(filter.limit) || 10;

    return await WalletRepository.getTransactions(
      page,
      limit,
      filter.search,
      id
    );
  }
}

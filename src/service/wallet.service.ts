import { Types } from "mongoose";
import { WalletRepository } from "../repository/wallet.repository";
import { transferValidator, validatePin } from "../validation/wallet.validator";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import bcrypt from "bcrypt";
export class WalletService {
  static getWallet(userId: Types.ObjectId) {}

  static transfer(userId: Types.ObjectId) {}

  static async getWalletByAccountNumber(accountNumber: string) {
    const res = await WalletRepository.findAccountNumber(accountNumber);
    if (!res) return null;
    return res;
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

    return "Transaction  Pin updated!";
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
    //validate pin
    const { error } = transferValidator.validate(data);
    if (error) throw throwCustomError(error.message, 422);

    const sendersWallet = await WalletRepository.getWalletByUserId(userId);
    if (!sendersWallet) throw throwCustomError("Account not found", 404);

    const isValid = await WalletRepository.findAccountNumber(
      data.accountNumber
    );
    if (!isValid) throw throwCustomError("Invalid recipient account ", 404);

    //check pin

    if (!sendersWallet.transaction_pin)
      throw throwCustomError(
        "Please create a transaction pin to continue",
        400
      );
    const isValidPin = await bcrypt.compare(
      data.pin,
      sendersWallet.transaction_pin
    );

    if (!isValidPin) throw throwCustomError("Invalid pin", 400);

    // check for insuficient fund

    if (sendersWallet.account_number === data.accountNumber)
      throw throwCustomError("You cannot sent money to this account", 400);
    const walletBalance = parseFloat(sendersWallet.balance.toString());
    

    if (data.amount > walletBalance)
      throw throwCustomError("Insuficient fund", 400);

    // transfer money

    const debit = await WalletRepository.debitAccount(
      sendersWallet.account_number,
      data.amount
    );

    const credit = await WalletRepository.creditAccount(
      data.accountNumber,
      data.amount
    );

    console.log(debit, credit);

    return "Tansaction successful";
  }
}

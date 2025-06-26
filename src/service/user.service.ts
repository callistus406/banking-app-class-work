import * as crypto from "crypto";
import { UserRepository } from "../repository/user.repository";
import { IPreRegister, IRegister } from "../@types/user";
import bcrypt from "bcrypt";
import { WalletRepository } from "../repository/wallet.repository";
export class UserService {
  static async preRegister(user: IPreRegister) {
    try {
      // find if user exists
      const isFound = await UserRepository.findUserByEmail(user.email);

      if (isFound) throw new Error("Please login with your registered email");

      //create otp
      const otp = UserService.generateOtp();
      // send otp via mail

      console.log(otp);
    } catch (error) {
      console.log(error);
    }
  }

  static async register(user: IRegister) {
    // find if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (isFound) throw new Error("Please login with your registered email");

    //   password check
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) throw new Error("Some thing went wrong");
    // create account
    const account = await UserRepository.createUser(user);

    // create wallet
    const wallet = await WalletRepository.createWallet({
      userId: account._id,
      acccountNumber: UserService.genAccountNumber(),
    });

    return "Accoun created successfully";
    //send a response
  }

  static  generateOtp() {
    const otp = crypto.randomInt(100000, 999999);

    return otp;
  }

  //   private async isAccountExist(accountNumber: string) {
  //     const account = await WalletRepository.findAccountNumber(accountNumber);

  //     const condition = account ? account : false;
  //     do {
  //       const number = this.genAccountNumber();
  //     } while (condition);
  //   }

  static  genAccountNumber() {
    let accountNumber = "";
    const characters = "0123456789";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      accountNumber += characters.charAt(randomIndex);
    }

    return accountNumber;
  }
}

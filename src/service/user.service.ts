import * as crypto from "crypto";
import { UserRepository } from "../repository/user.repository";
import { IPreRegister, IRegister } from "../@types/user";
import bcrypt from "bcrypt";
import { WalletRepository } from "../repository/wallet.repository";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import { any } from "joi";
export class UserService {
  static async preRegister(user: IPreRegister) {
    try {
      // find if user exists
      const isFound = await UserRepository.findUserByEmail(user.email);

      if (isFound) throw throwCustomError("Please login with your registered email", 400);

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
    if (isFound) throw throwCustomError("Please login with your registered email", 400);

      //   password checkAdd commentMore actions
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) throw throwCustomError("Some thing went wrong", 500);

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
    console.log("Generated OTP:", otp);

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

  static async login(email: string, password: string): Promise<any> {
    // find if user exists
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw throwCustomError("Please register to continue", 400);

    // check password
    const hashedPassword = await bcrypt.compare(password, user.password as string);
    if (!hashedPassword == !password) throw throwCustomError("Invalid credentials", 400);

    return user;
    
  }
}

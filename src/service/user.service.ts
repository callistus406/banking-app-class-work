import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRETf } from "../config/system.variable";
import { UserRepository } from "../repository/user.repository";
import { IPreRegister, IRegister } from "../@types/user";
import bcrypt from "bcrypt";
import { WalletRepository } from "../repository/wallet.repository";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import { any } from "joi";
import { sendMail } from "../until/nodemailer";
import { otpTemplate } from "../until/otp-template";
export class UserService {
  static async preRegister(user: IPreRegister) {
    // find if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);

    if (isFound)
      throw throwCustomError("Please login with your registered email", 400);

    //create otp
    const otp = UserService.generateOtp();
    // send otp via mail

    sendMail(
      {
        email: user.email,
        subject: "OTP VERIFICATIION",
        otp: otp.toString(),
        name: `${user.last_name} ${user.first_name}`,
      },
      otpTemplate
    );

    return "An email has been sent to you inbox";
    console.log(otp);
  }

  static async register(user: IRegister) {
    // find if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (isFound)
      throw throwCustomError("Please login with your registered email", 400);

    //   password checkAdd commentMore actions
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) throw throwCustomError("Some thing went wrong", 500);

    // create account
    const account = await UserRepository.createUser({...user,password:hashedPassword,},true);

    if (!account) throw throwCustomError("Unable to complete signup", 500);

    //generate account number

    const accountNumber = await UserService.genUniqeAccountNumber();
    if (accountNumber) {
      // create wallet
      const wallet = await WalletRepository.createWallet({
        userId: account._id,
        acccountNumber: accountNumber,
      });
      if (!wallet) {
        await UserRepository.deleteUserByuId(account._id);
      }
    }

    return "Account created successfully";
    //send a response
  }

  static generateOtp() {
    const otp = crypto.randomInt(100000, 999999);
    console.log("Generated OTP:", otp);

    return otp;
  }

  static async genUniqeAccountNumber() {
    // const account = await WalletRepository.findAccountNumber(accountNumber);
    let accountNumber = "";
    let inValid = true; // accountnumber exists in our db
    do {
      accountNumber = UserService.genAccountNumber();
      inValid = !inValid;
    } while (inValid);

    return accountNumber;
  }

  static genAccountNumber(length=10) {
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

    if (!user.is_veified) {
      throw throwCustomError("Please verify your email before logging in", 400);
    }
      

    // check passwor
    const hashedPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!hashedPassword)
      throw throwCustomError("Invalid credentials", 400);

     const otp = UserService.generateOtp();

      sendMail(
      {
        email: email,
        subject: "there a Loggin made on your account, if this is not you, please contact support Team on support@example.com ",
         otp: otp.toString(),
        name: `${user.last_name} ${user.first_name}`,
      },
      otpTemplate 
    );

    const payload = {
      username: user.first_name,
      email: user.email,
    };

    console.log(JWT_SECRETf);

    let jwttoken = jwt.sign(payload, JWT_SECRETf as string, {
      expiresIn: "5m",
    });
    console.log(jwttoken);

    return (
      {
        message: "Login successful",
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        authkey: jwttoken,
      }
    );

    

  }
}

import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
//import jwt from "jsonwebtoken";
import { JWT_EXP, JWT_SECRET } from "../config/system.variable";
import { UserRepository } from "../repository/user.repository";
import { IPreRegister, IRegister } from "../@types/user";
import bcrypt from "bcrypt";
import { WalletRepository } from "../repository/wallet.repository";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import { sendMail } from "../until/nodemailer";
import { otpTemplate } from "../until/otp-template";
import { confirmationTemplate } from "../until/login-confirmation-template";
import { OTPModel } from "../models/otp.model";
import { userModel } from "../models/user.model";
export class UserService {
  static async preRegister(user: IPreRegister) {
    // find if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);

    if (isFound)
      throw throwCustomError("Please login with your registered email", 400);

    //create otp
    const otp = await UserService.generateOtp(user.email);
    // send otp via mail

    sendMail(
      {
        email: user.email,
        subject: "OTP VERIFICATIION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.last_name} ${user.first_name}`,
        },
      },
      otpTemplate
    );

    return "An email has been sent to you inbox";
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
    const account = await UserRepository.createUser(
      { ...user, password: hashedPassword },
      true
    );

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

  static async generateOtp(email: string) {
    const otp = crypto.randomInt(100000, 999999);
    console.log("Generated OTP:", otp);
    //save otp

    await OTPModel.create({ email, otp });
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

  static genAccountNumber(length = 10) {
    let accountNumber = "";
    const characters = "0123456789";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      accountNumber += characters.charAt(randomIndex);
    }

    return accountNumber;
  }

  static async login(
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<any> {
    // find if user exists
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw throwCustomError("Invalid credentials", 401);

    if (!user.is_veified) {
      throw throwCustomError("Please verify your email before logging in", 401);
    }

    // check password
    const hashedPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!hashedPassword)
      throw throwCustomError("Invalid email or password", 400);

    const payload = {
      username: user.first_name,
      email: user.email,
    };

    console.log(JWT_SECRET);

    let jwttoken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP,
    } as any);

    if (!jwttoken) throw throwCustomError("Unable to login", 500);

    sendMail(
      {
        email: email,
        subject: "Login Confirmation",
        emailInfo: {
          ipAddress: ipAddress,
          userAgent: userAgent,
          name: `${user.last_name} ${user.first_name}`,
        },
      },
      confirmationTemplate
    );
    return {
      message: "Login successful",
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      authkey: jwttoken,
    };
  }

  static async requestPasswordReset(email: string) {
    const user = await UserRepository.findUserByEmail(email);

    if (!user) throw throwCustomError("Invalid account", 400);

    if (!user.is_veified) throw throwCustomError("Unverified account", 401);

    //create otp
    const otp = await UserService.generateOtp(email);
    // send otp via mail

    sendMail(
      {
        email: email,
        subject: "OTP VERIFICATIION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.last_name} ${user.first_name}`,
        },
      },
      otpTemplate
    );

    return "An email has been sent to you inbox";
  }

  static async validateOtp(email:string,otp:string){
  const user = await UserRepository.findUserByEmail(email);

    if (!user) throw throwCustomError("Invalid account", 400);

    if (!user.is_veified) throw throwCustomError("Unverified account", 401);

    const isValid = await UserRepository.findOtpBymail(email,otp)
    if (!isValid) throw throwCustomError("Invalid Otp", 400);


    return  "Otp verified"

  } 
  
  static async resetPassword(otp: number, newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      throw throwCustomError("Passwords do not match", 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) throw throwCustomError("Unable to reset password", 500);

   const user = await UserRepository.findOneAndUpdate(
    { otp},
    { password: hashedPassword, otp: null },
    { new: true } // Return the updated user
  ) ;

   if (!user) throw throwCustomError("Invalid OTP", 400);

    return "Password reset successfully";
  } 

  
}

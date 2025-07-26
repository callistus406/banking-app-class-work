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
import {
  emailSchema,
  preSchema,
  registerschema,
  validateKyc,
  validateOtp,
  validateResetPassword,
} from "../validation/user-schema";
import { accountInfoTemplate } from "../until/wallet-template";
import { Types } from "mongoose";
import { kycRecords } from "../until/kyc-records";
export class UserService {
  static async preRegister(user: IPreRegister) {
    //validations

    const { error } = preSchema.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

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

    return "An email has been sent to your inbox";
  }

  static async register(user: IRegister) {
    const { error } = registerschema.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    // find if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (isFound)
      throw throwCustomError("Please login with your registered email", 400);

    //   password checkAdd commentMore actions
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) throw throwCustomError("Something went wrong", 500);

    // create account
    const account = await UserRepository.createUser(
      { ...user, password: hashedPassword },
      true
    );

    if (!account) throw throwCustomError("Unable to complete signup", 500);

    const accountNumber = await UserService.genUniqeAccountNumber();
    if (accountNumber) {
      const wallet = await WalletRepository.createWallet({
        userId: account._id,
        acccountNumber: accountNumber,
      });
      if (!wallet) {
        await UserRepository.deleteUserByuId(account._id);
      }
    }

    sendMail(
      {
        email: user.email,
        subject: "WALLET CONFIRMATION",
        emailInfo: {
          customerName: `${user.last_name} ${user.first_name}`,
          accountName: `${user.last_name} ${user.first_name}`,
          accountNumber: accountNumber,
          name: `${user.last_name} ${user.first_name}`,
        },
      },
      accountInfoTemplate
    );

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
      userId: user._id,
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
    //validate email27017

    const { error, value } = emailSchema.validate({ email });

    if (error) throw throwCustomError(error.message, 422);

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

  static async validateOtp(email: string, otp: string) {
    const { error } = validateOtp.validate({ email, otp });

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    if (isNaN(parseInt(otp))) throw throwCustomError("Otp must digits", 422);
    const user = await UserRepository.findUserByEmail(email);

    if (!user) throw throwCustomError("Invalid account", 400);

    if (!user.is_veified) throw throwCustomError("Unverified account", 401);

    const isValid = await UserRepository.findOtpBymail(email, otp);
    if (!isValid) throw throwCustomError("Invalid Otp", 400);

    return "Otp verified";
  }

  static async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const { email, otp, newPassword, confirmPassword } = data;

    const { error } = validateResetPassword.validate(data);
    if (error) {
      throw throwCustomError(error.message, 422);
    }

    const user = await UserRepository.findUserByEmail(email);

    if (!user) throw throwCustomError("Invalid account", 400);

    const isValid = await UserRepository.findOtpBymail(email, otp);
    if (!isValid) throw throwCustomError("Invalid Otp", 400);

    if (newPassword.trim() !== confirmPassword.trim()) {
      throw throwCustomError("Passwords do not match", 400);
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return "Password reset successfully";
  }

  //=====================================|| User MGT ||============================

  static fetchProfile = async (id: Types.ObjectId) => {
    const profile = await UserRepository.findUserProfile(id);
    if (!profile) {
      throw throwCustomError("User not found", 422);
    }
    return profile;
  };

  //=========================================|| KYC SECTION ||==================================

  static verifyKyc = async (data: {
    first_name: string;
    last_name: string;
    dateOfBirth: string;
    nin: string;
    bvn: string;
    userId: Types.ObjectId;
  }) => {
    const { first_name, last_name, dateOfBirth, nin, bvn, userId } = data;
    //check if user has  alread  done kyc

    const user = await UserRepository.findUserById(data.userId);

    if (!user) throw throwCustomError("User not found", 404);

    if (user.kycStatus === "APPROVED")
      throw throwCustomError("You have already completed your kyc", 400);

    const { error } = validateKyc.validate({
      first_name,
      last_name,
      dateOfBirth,
      nin,
      bvn,
    });

    if (error) throw throwCustomError(error.message, 422);

    //call external api
    const isUser = kycRecords.find(
      (user) => user.first_name === first_name && user.last_name === last_name
    );
    if (!isUser) throw throwCustomError("invalid user", 422);

    const isDob = kycRecords.find((x) => x.dateOfBirth === dateOfBirth);
    if (!isDob) throw throwCustomError("Invalid credentials", 422);

    const result = kycRecords.find(
      (item) =>
        item.nin === nin &&
        item.first_name === first_name &&
        item.last_name === last_name
    );
    if (!result) throw throwCustomError("NIN match not found", 404);

    const result2 = kycRecords.find(
      (item) =>
        item.bvn === bvn &&
        item.first_name === first_name &&
        item.last_name === last_name
    );

    if (!result2) throw throwCustomError("BVN match not found", 404);

    //kyc should be approved

    const res = await UserRepository.saveKyc({ nin, bvn, userId });

    if (!res) throw throwCustomError("Unable to Verify KYC", 500);

    return "Your KYC has been approved";
  };

  static async updateProfile(id: Types.ObjectId, user: any) {
    const { error } = registerschema.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    const response = await UserRepository.updateProfile(id, user);

    if (!response) throw throwCustomError("Unable to update profile", 500);

    return response;
  }

  static async uploadProfile(path: string) {
    const domain = `http://localhost:4000/${path}`;

    const profile = await UserRepository.UploadProfileImage(domain);

    if (!profile) {
      throw throwCustomError("Unable to update profile", 500);
    }
  }
}

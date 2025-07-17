import { ObjectId, Types } from "mongoose";
import { IRegister } from "../@types/user";
import { userModel } from "../models/user.model";
import { OTPModel } from "../models/otp.model";
import { UploadModel, uploadSchema } from "../models/upload.model";
import { upload } from "../config/multer.config";

export class UserRepository {
  //createUser

  static async createUser(user: IRegister, is_verified: boolean) {
    const response = await userModel.create({
      ...user,
      is_veified: is_verified,
    });

    return response;
  }

  static async findUserById(userId: Types.ObjectId) {
    const response = await userModel.findById(userId);
    if (!response) return null;
    return response;
  }

  static async findUserByEmail(email: string) {
    const response = await userModel.findOne({ email });
    if (!response) return null;
    return response;
  }

  static async findUserProfile(id: Types.ObjectId) {
    const response = await userModel
      .findById(id)
      .select("-password -isVerified  -__v -_id");
    if (!response) return null;
    return response;
  }

  //   static async findUserByEmailOrPhone(email: string) {
  //     const response = await userModel.findOne({ email });
  //     if (!response) return null;
  //     return response;
  //   }
  static async findUserByPhoneNumber(phoneNumber: string) {
    const response = await userModel.findOne({ phone_number: phoneNumber });
    if (!response) return null;
    return response;
  }

  static async login(email: string, password: string): Promise<any> {
    const user = await userModel.findOne({ email, password });
    return user;
  }

  static async deleteUserByuId(userId: Types.ObjectId) {
    const response = await userModel.deleteOne({
      _id: userId,
    });
    if (!response) return null;

    return response;
  }

  static async findOtpBymail(email: string, otp: string) {
    const response = await OTPModel.findOne({ email, otp });

    if (!response) return null;

    return response;
  }

  static async findUserProfile(id: Types.ObjectId){
    const response = await userModel.findById(id)

    return response;

  }


  static async updateProfile(id: Types.ObjectId, user: any) {
    const response = await userModel.findByIdAndUpdate(id, user, { new: true });
    if (!response) return null;
    return response;
  }

  static async findUserProfile(id: Types.ObjectId){
    const response = await userModel.findById(id)

    return response;

  }


  static async updateProfile(id: Types.ObjectId, user: any) {
    const response = await userModel.findByIdAndUpdate(id, user, { new: true });
    if (!response) return null;
    return response;
  }

  static async resetpassword(otp: number) {
    const response = await userModel.findOne({ otp });
    if (!response) return null;
    // const response  = await userModel.findOneAndUpdate(
    //   { otp },
    //   { password: newPassword, otp: null },
    //   { new: true }
    // );

    return response;
  }

  static async saveKyc(data: {
    nin: string;
    bvn: string;
    userId: Types.ObjectId;
  }) {
    const response = await userModel.findByIdAndUpdate(data.userId, {
      nin: data.nin,
      bvn: data.bvn,
      kycStatus: "APPROVED",
    });
    if (!response) return null;

    return response;
  }




    static async UploadProfileImage(path: string) {
       if (!path || typeof path !== 'string') {
    throw new Error('A valid image path is required.');
  }
      const response = await UploadModel.create({
        filePath: path
      });

      return response;
    }
}

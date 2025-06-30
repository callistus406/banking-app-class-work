import { Types } from "mongoose";
import { IRegister } from "../@types/user";
import { userModel } from "../models/user.model";

export class UserRepository {
  //createUser

  static async createUser(user: IRegister) {
    const response = await userModel.create({
      ...user,
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
    return user
  }
}

import { asyncWrapper } from "../middleware/asyncWrapper";
import { Request, Response } from "express";
import { IPreRegister } from "../@types/user";
import { UserService } from "../service/user.service";
import { invalidTokens, IRequest } from "../middleware/auth.middleware";
import { validateKyc } from "../validation/user-schema";
import { throwCustomError } from "../middleware/errorHandler.midleware";
import { kycRecords } from "../until/kyc-records";
import { UserRepository } from "../repository/user.repository";

export class AuthController {
  static presignUp = asyncWrapper(async (req: Request, res: Response) => {
    const data = req.body as IPreRegister;

    const response = await UserService.preRegister(data);

    res.status(201).json({ success: true, payload: response });
  });

  static register = asyncWrapper(async (req: Request, res: Response) => {
    const User = req.body;

    const response = await UserService.register(User);

    res.status(201).json({ success: true, payload: response });
  });

  static login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const ipAddress = req.ip as string;
    const userAgent = req.headers["user-agent"] as string;
    const response = await UserService.login(
      email,
      password,
      ipAddress,
      userAgent
    );

    res.status(200).json({ success: true, payload: response });
  });

  static requestPasswordReset = asyncWrapper(
    async (req: Request, res: Response) => {
      const { email } = req.body;

      const response = await UserService.requestPasswordReset(email);

      res.status(200).json({ success: true, payload: response });
    }
  );
  static validateOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const response = await UserService.validateOtp(email, otp);

    res.status(200).json({ success: true, payload: response });
  });

  static resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const { newPassword, confirmPassword, otp, email } = req.body;

    const response = await UserService.resetPassword({
      email,
      newPassword,
      otp,
      confirmPassword,
    });

    res.status(200).json({ success: true, payload: response });
  });

  static getProfile = asyncWrapper(async (req: IRequest, res: Response) => {
    const response = await UserService.fetchProfile(req.user.id);

    res.status(200).json({ success: true, payload: response });
  });

  static updateProfile = asyncWrapper(async (req: IRequest, res: Response) => {
    const { firstName, lastName } = req.body;
    const id = req.user.id;

    const response = await UserService.updateProfile(id, {
      firstName,
      lastName,
    });

    res.status(200).json({ success: true, payload: response });
  });

  static logout = asyncWrapper(async (req: IRequest, res: Response) => {
    const token = req.headers.authorization?.split("Bearer ")[1] as string;

    invalidTokens.push(token);

    res.status(200).json({ success: true, payload: "Logout successful" });
  });

  //=========================================|| KYC SECTION ||==================================

  static bvnNinVerification = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const { dateOfBirth, bvn, nin } = req.body;
      const userId = req.user.id;

      const response = await UserService.verifyKyc({
        dateOfBirth,
        nin,
        bvn,
        userId,
      });

      res.status(200).json({ success: true, payload: response });
    }
  );

  static async uploadProfile(req: Request, res: Response) {
    const path = req.file?.path;
    console.log("File path:", path);

    if (!path) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const response = await UserService.uploadProfile(path);

    res.status(200).json({ success: true, payload: response });
  }
}

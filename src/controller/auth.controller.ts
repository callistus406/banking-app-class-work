import { asyncWrapper } from "../middleware/asyncWrapper";
import { Request, Response } from "express";
import { IPreRegister } from "../@types/user";
import { UserService } from "../service/user.service";

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

  static resetPassword = asyncWrapper(
    async (req: Request, res: Response) => {
      const { otp, newPassword, confirmPassword } = req.body;

      const response = await UserService.resetPassword(
        otp,
        newPassword,
        confirmPassword
      );

      res.status(200).json({ success: true, payload: response });
    });
}

import { asyncWrapper } from "./../middleware/asyncWrapper";
import { Request, Response } from "express";
import { IPreRegister } from "../@types/user";
import { UserService } from "../service/user.service";

export class UserController {
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

    const response = await UserService.login(email, password);

    res.status(200).json({ success: true, payload: response });
  });
}

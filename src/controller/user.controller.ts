import { Request, Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IPreRegister } from "../@types/user";
import { UserService } from "../service/user.service";

export class UserController {
  static async presignUp(req: Request, res: Response) {
    const data = req.body as IPreRegister;
console.log(data);

    const response = await UserService.preRegister(data);

    res.status(201).json({ success: true, payload: response });
  };

  static async register(req: Request, res: Response) {
    const User = req.body;

    const response = await UserService.register(User);

    res.status(201).json({ success: true, payload: response});
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
  
      const response = await UserService.login(email, password);
  
      res.status(200).json({ success: true, payload: response });

    } catch (err: any) {
      res.status(500).json({ success: false, payload: err.message as string });
    }
  }
};

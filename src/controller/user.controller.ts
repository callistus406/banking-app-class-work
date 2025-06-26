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
  }
}

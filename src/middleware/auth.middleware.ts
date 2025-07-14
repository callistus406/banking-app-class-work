import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRETE } from "../config/system-variables";
import { userModel } from "../models/user.model";
import { Types } from "mongoose";

export interface IRequest extends Request {
  user: any;
}

export const invalidTokens:string[] = []
export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split("Bearer ")[1];

  if (!token) return res.sendStatus(401);
  console.log(token);


  //check for blacklisted token

  if(invalidTokens.includes(token)) return res.status(403).json({
    success:false,
    message: "Forbidden"
  })
  jwt.verify(token, JWT_SECRETE, async (err, data: any) => {
    if (err) {
      return res.sendStatus(401);
    }

    const user = await userModel.findById(new Types.ObjectId(data.userId));
    console.log(data);

    if (!user) return res.sendStatus(401);
    req.user = {
      firstName: user?.first_name,
      email: user?.email,
      id: user._id,
    };
    next();
  });
};

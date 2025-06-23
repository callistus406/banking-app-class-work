import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRETE } from "../config/system-variables";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
):any => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split("Bearer ")[1];

  if (!token) return res.sendStatus(401);
  console.log(token);

  jwt.verify(token, JWT_SECRETE, (err, data) => {
    if (err) {
     return res.sendStatus(401);
    }

    next();
  });
};







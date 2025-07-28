import { NextFunction, Response } from "express";
import { IRequest } from "./auth.middleware";

export const verifyKyc = (req: IRequest, res: Response, next: NextFunction) => {
  if (!req.user.kycStatus || req.user.kycStatus !== "APPROVED") {
    res
      .status(400)
      .json({ success: false, payload: "Pls complete your kyc  to proceed" });
  } else {
    next();
  }
};

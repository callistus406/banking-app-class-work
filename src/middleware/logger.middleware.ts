import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.warn(
    `This is a  request was made by ${req.ip}, at ${new Date()}`
  );

  next();
};


// validation, mongodb
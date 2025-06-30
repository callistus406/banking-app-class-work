import joi, { ObjectSchema } from "joi";

import { NextFunction, Request, Response } from "express";

export function validator(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body,{ abortEarly: false });

    if (error) {
      const msg = error.details.map((err) => err.message);
       res.status(400).json({ errors: msg });
    }

    req.body = value;
    next();
  };
}

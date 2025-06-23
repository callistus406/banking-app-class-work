import joi, { ObjectSchema } from "joi";

import { NextFunction, Request, Response } from "express";

export function validator(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body,{ abortEarly: false });

    if (error) {
      const msg = error.details.map((err) => err.message);
      return res.status(400).json({ errors: msg });
    }

    req.body = value;
    next();
  };
}

// import { NextFunction, Request, Response } from "express";
// import { plainToInstance } from "class-transformer";
// import { IsEmail, validate, ValidationError } from "class-validator";

// export function validator(classDto: any) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const dtoObject = plainToInstance(classDto, req.body);

//     const errors: ValidationError[] = await validate(classDto);

//     if (errors.length > 0) {
//       const msg = errors.map((error) => Object.values(error.constraints || {}));
//       return res.status(400).json({ message: msg });
//     }

//     req.body = dtoObject;
//     next();
//   };
// }

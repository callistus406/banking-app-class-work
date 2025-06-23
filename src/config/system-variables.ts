import dotenv from "dotenv";
dotenv.config();


export const JWT_SECRETE = process.env.JWT_SECRETE as string;
import dotenv from "dotenv";
dotenv.config();


export const JWT_SECRETE = process.env.JWT_SECRETE as string;
export const DB_CONNECTION_URL = process.env.DB_CONNECTION_URI as string;
import dotenv from 'dotenv';
import { JWT_SECRETE } from './system-variables';

dotenv.config();

export const JWT_SECRET=process.env.JWT_SECRETE as string;
export const JWT_EXP=process.env.JWT_EXP as string;



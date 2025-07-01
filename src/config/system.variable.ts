import dotenv from 'dotenv';
import { JWT_SECRETE } from './system-variables';

dotenv.config();

export const JWT_SECRETf=process.env.JWT_SECRETE;
 if (!JWT_SECRETE) {
  throw new Error('JWT_SECRET environment variable is missing');
}
console.log("jwt secret", JWT_SECRETE);
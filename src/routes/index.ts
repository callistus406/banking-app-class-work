import express from "express";
import { AuthController } from "../controller/auth.controller";
import { validator } from "../middleware/validator.middleware";
import { preSchema , registerschema } from "../validation/user-schema";
//import { authMiddleware } from "../middleware/auth.middleware";


const router = express.Router();

router.post("/pre-register",validator(preSchema) ,AuthController.presignUp);
router.post("/register", validator(registerschema), AuthController.register);
 router.post("/login", AuthController.login);
 router.post("/request-password-rest", AuthController.requestPasswordReset);
 router.post("/verify-otp", AuthController.validateOtp);

export default router;

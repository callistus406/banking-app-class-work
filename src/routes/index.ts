import express from "express";
import { UserController } from "../controller/user.controller";
import { validator } from "../middleware/validator.middleware";
import { preSchema , registerschema } from "../validation/user-schema";
//import { authMiddleware } from "../middleware/auth.middleware";


const router = express.Router();

router.post("/pre-register",validator(preSchema) ,UserController.presignUp);
router.post("/register", validator(registerschema), UserController.register);
 router.get("/login", UserController.login);

export default router;

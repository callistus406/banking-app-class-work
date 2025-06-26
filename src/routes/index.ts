import express from "express";
import { UserController } from "../controller/user.controller";

const router = express.Router();

router.post("/pre-register", UserController.presignUp);

export default router;

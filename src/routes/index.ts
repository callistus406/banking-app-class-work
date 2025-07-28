import express from "express";
import { AuthController } from "../controller/auth.controller";
import { validator } from "../middleware/validator.middleware";
import { preSchema, registerschema } from "../validation/user-schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { WalletController } from "../controller/wallet.controller";
import { upload } from "../config/multer.config";
import { verifyKyc } from "../middleware/kyc.middleware";
//import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/pre-register", AuthController.presignUp);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/request-password-reset", AuthController.requestPasswordReset);
router.post("/verify-otp", AuthController.validateOtp);
router.post("/reset-password/:otp", AuthController.resetPassword);
router.get("/profile", authMiddleware as any, AuthController.getProfile);
router.patch(
  "/update-profile",
  authMiddleware as any,
  AuthController.updateProfile
);
router.post("/logout", authMiddleware as any, AuthController.logout);
router.get(
  "/wallets/search/:accountNumber",
  authMiddleware as any,
  WalletController.getWalletByAccountNumber as any
);
router.get(
  "/wallets",
  authMiddleware as any,
  WalletController.getWallets as any
);
router.patch(
  "/wallets/transaction-pin",
  authMiddleware as any,
  verifyKyc as any,
  WalletController.updateWalletPin as any
);
router.post(
  "/upload",
  upload.single("file") as any,
  AuthController.uploadProfile as any
);
router.post(
  "/kyc",
  authMiddleware as any,

  AuthController.bvnNinVerification
);
router.post(
  "/wallets/transfer",
  authMiddleware as any,
  verifyKyc as any,
  WalletController.transferMoney as any
);
router.get(
  "/wallets/transaction",
  authMiddleware as any,
  WalletController.transactions
);

export default router;

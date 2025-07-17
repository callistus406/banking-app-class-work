import express from "express";
import { AuthController } from "../controller/auth.controller";
import { validator } from "../middleware/validator.middleware";
import { preSchema, registerschema } from "../validation/user-schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { WalletController } from "../controller/wallet.controller";
//import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/pre-register", AuthController.presignUp);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/request-password-reset", AuthController.requestPasswordReset);
router.post("/verify-otp", AuthController.validateOtp);
router.post("/reset-password/:otp", AuthController.resetPassword);
router.patch("/profile", authMiddleware as any, AuthController.getProfile);
router.post("/logout", authMiddleware as any, AuthController.logout);
router.get("/wallet/:accountNumber", authMiddleware as any, WalletController.getWalletByAccountNumber as any);
router.get("/wallets", authMiddleware as any, WalletController.getWallets as any);
router.post("/wallets", authMiddleware as any, WalletController.updateWalletPin as any);
router.post("/upload", AuthController.uploadProfile as any);

export default router;

// ppk_live_27e0d8da7ed5818911944f70
// secrete
// psk_live_26f9ac7c71e5b8ba6a68afc8c25aca74

// {
//     "merchantId": "680a063892a3386adfcc7765",
//     "accountNumber": "1100013689",
//     "accountName": "Genius Merchant Account",
//     "subAccountPrefix": "GENIUSMER",
//     "bankName": "PettySave MFB",
//     "bankCode": "090768",
//     "provider": "qore",
//     "isVirtual": false,
//     "status": "active",
//     "balance": 0,
//     "currency": "NGN",
//     "providerMetadata": {
//         "CustomerIDInString": null,
//         "IsSuccessful": true,
//         "Message": {
//             "AccountNumber": "1100013689",
//             "BankoneAccountNumber": "08120011120001368",
//             "CreationMessage": null,
//             "CustomerID": "001368",
//             "FullName": "Doe John",
//             "Id": 1973
//         },
//         "Page": null,
//         "TransactionTrackingRef": null
//     },
//     "archived": false,
//     "_id": "6869324c5c573ecfee01041f",
//     "createdAt": "2025-07-05T14:10:20.068Z",
//     "updatedAt": "2025-07-05T14:10:20.068Z",
//     "__v": 0,
//     "accountId": "6869324c5c573ecfee01041f"
// }

// psk_live_de5eb6dcf618190bba06ef1cf948af29

// ppk_live_56fc0079a81f1dfa5e9998de

import { asyncWrapper } from "./../middleware/asyncWrapper";
import { Response } from "express";
import { IRegister } from "../@types/user";
import { WalletService } from "../service/wallet.service";
import { IRequest } from "../middleware/auth.middleware";
import { Types } from "mongoose";

export class WalletController {
  static getWalletByAccountNumber = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const { accountNumber } = req.params;
      const response = await WalletService.getWalletByAccountNumber(
        accountNumber
      );

      res.status(200).json({
        success: true,
        payload: response,
      });
    }
  );

  static getWallets = asyncWrapper(async (req: IRequest, res: Response) => {
    const response = await WalletService.getwallets();

    res.status(200).json({
      success: true,
      payload: response,
    });
  });
  static updateWalletPin = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const { pin, confirmPin } = req.body;

      const userId = req.user.id;
      const response = await WalletService.updateWalletPin(userId, {
        pin,
        confirmPin,
      });

      res.status(200).json({
        success: true,
        payload: response,
      });
    }
  );

  static transferMoney = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { accountNumber, amount, pin, description } = req.body;

    const response = await WalletService.transferMoney(userId, {
      accountNumber,
      amount,
      pin,
      description,
    });

    res.status(200).json({
      success: true,
      payload: response,
    });
  });

  // static transactionHistory = asyncWrapper(
  //   async (req: IRequest, res: Response) => {
  //     const accountId = req.params.accountId;

  //     if (!accountId) {
  //       return res.status(400).json({
  //         success: false,
  //         payload: "Account ID is missing from request.",
  //       });
  //     }

  //     const response = await WalletService.createTransactionHistory(
  //       new Types.ObjectId(accountId)
  //     );
  //     return res.status(200).json({
  //       success: true,
  //       payload: response,
  //     });
  //   }
  // );
}

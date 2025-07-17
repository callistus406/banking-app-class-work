import { asyncWrapper } from "./../middleware/asyncWrapper";
import { Response } from "express";
import { IRegister } from "../@types/user";
import { WalletService } from "../service/wallet.service";
import { IRequest } from "../middleware/auth.middleware";

export class WalletController {
  static getWalletByAccountNumber = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const { accountNumber } = req.body;
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
}

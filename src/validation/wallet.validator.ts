import Joi from "joi";

export const validatePin = Joi.object({
  pin: Joi.string()
    .length(4)
    .trim()
    .pattern(/^[0-9]+$/)
    .message("Pin must be 4 digits")
    .required(),
  confirmPin: Joi.string()
    .length(4)
    .trim()
    .pattern(/^[0-9]+$/)
    .message("Confirm pin must be 4 digits")
    .required(),
});

export const transferValidator = Joi.object({
  pin: Joi.string()
    .length(4)
    .trim()
    .pattern(/^[0-9]+$/)
    .required(),

  amount: Joi.number().positive().required(),

  accountNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),

  description: Joi.string().max(100).required(),

  accountName: Joi.string().max(100).optional(),
});

export const transactionHistoryValidator = Joi.object({
  senders_account: Joi.string().length(10).required(),
  recievers_account: Joi.string().max(100).required(),
  amount: Joi.number().positive().required(),
  status: Joi.string().length(4).optional(),
  tx_ref: Joi.string().max(100).required(),
});

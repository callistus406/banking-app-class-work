import Joi from "joi"


export const validatePin = Joi.object({
  pin: Joi.string().length(4).trim().pattern(/^[0-9]+$/).message("Pin must contain only numbers").required(),
  confirmPin: Joi.string().length(4).trim().pattern(/^[0-9]+$/).message("Pin must contain only numbers").required(),

});

export const transferValidator = Joi.object({
  pin: Joi.string().length(4).trim().pattern(/^[0-9]+$/).message("Pin must contain only numbers").required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
  accountNumber: Joi.string().length(10).required(),
  accountName: Joi.string().max(20).optional(),

});


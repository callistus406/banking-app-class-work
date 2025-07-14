import Joi from "joi"


export const validatePin = Joi.object({
  pin: Joi.string().length(4).trim().required(),
  confirm: Joi.string().length(6).trim().required(),

});


import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const preSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
});

export const registerschema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  otp: Joi.number().required(),
});

export const profilechema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const validateOtp = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const validateResetPassword = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
  otp: Joi.string().length(6).required(),
});

export const validateKyc = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  nin: Joi.string().length(11).required(),
  bvn: Joi.string().length(11).required(),
});

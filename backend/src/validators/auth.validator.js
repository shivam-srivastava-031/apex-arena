const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  phone: Joi.string().min(8).max(20).required(),
  bgmiId: Joi.string().min(3).max(60).required(),
  password: Joi.string().min(6).max(128).required()
});

const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};

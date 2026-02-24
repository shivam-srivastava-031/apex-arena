const Joi = require('joi');

const banUserSchema = Joi.object({
  isBanned: Joi.boolean().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(60).optional(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().optional(),
  bgmiId: Joi.string().optional(),
  ffId: Joi.string().allow('', null).optional(),
  dob: Joi.date().iso().allow('', null).optional()
});

module.exports = {
  banUserSchema,
  updateProfileSchema
};

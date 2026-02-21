const Joi = require('joi');

const banUserSchema = Joi.object({
  isBanned: Joi.boolean().required()
});

module.exports = {
  banUserSchema
};

const Joi = require('joi');

const submitResultSchema = Joi.object({
  tournamentId: Joi.string().hex().length(24).required(),
  teamId: Joi.string().hex().length(24).allow(null).optional(),
  position: Joi.number().integer().min(1).required(),
  screenshotUrl: Joi.string().uri().required()
});

const updateResultSchema = Joi.object({
  position: Joi.number().integer().min(1).optional(),
  screenshotUrl: Joi.string().uri().optional(),
  verified: Joi.boolean().optional(),
  isWinner: Joi.boolean().optional()
});

const markWinnerSchema = Joi.object({
  isWinner: Joi.boolean().valid(true).required()
});

module.exports = {
  submitResultSchema,
  updateResultSchema,
  markWinnerSchema
};

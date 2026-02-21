const Joi = require('joi');

const playerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  bgmiId: Joi.string().min(2).max(60).required()
});

const initiateBookingSchema = Joi.object({
  tournamentId: Joi.string().hex().length(24).required(),
  selectedTeamSize: Joi.number().integer().min(1).max(10).required(),
  players: Joi.array().items(playerSchema).min(1).max(10).required(),
  metadata: Joi.object().optional()
});

const confirmPaymentSchema = Joi.object({
  paymentId: Joi.string().hex().length(24).required(),
  paymentStatus: Joi.string().valid('SUCCESS', 'FAILED').required(),
  providerTransactionId: Joi.string().allow('', null).optional(),
  metadata: Joi.object().optional()
});

module.exports = {
  initiateBookingSchema,
  confirmPaymentSchema
};

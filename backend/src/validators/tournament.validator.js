const Joi = require('joi');
const { TOURNAMENT_MODES, TOURNAMENT_STATUS } = require('../constants/enums');

const createTournamentSchema = Joi.object({
  title: Joi.string().max(120).required(),
  gameName: Joi.string().max(80).required(),
  mode: Joi.string().valid(...Object.values(TOURNAMENT_MODES)).required(),
  teamSize: Joi.number().integer().min(1).max(10).required(),
  entryFee: Joi.number().min(0).required(),
  totalSlots: Joi.number().integer().min(1).required(),
  prizePool: Joi.number().min(0).required(),
  startDateTime: Joi.date().iso().required(),
  registrationDeadline: Joi.date().iso().required(),
  status: Joi.string().valid(...Object.values(TOURNAMENT_STATUS)).default(TOURNAMENT_STATUS.DRAFT),
  roomId: Joi.string().allow(null, '').optional(),
  roomPassword: Joi.string().allow(null, '').optional()
});

const updateTournamentSchema = Joi.object({
  title: Joi.string().max(120).optional(),
  gameName: Joi.string().max(80).optional(),
  mode: Joi.string().valid(...Object.values(TOURNAMENT_MODES)).optional(),
  teamSize: Joi.number().integer().min(1).max(10).optional(),
  entryFee: Joi.number().min(0).optional(),
  totalSlots: Joi.number().integer().min(1).optional(),
  prizePool: Joi.number().min(0).optional(),
  startDateTime: Joi.date().iso().optional(),
  registrationDeadline: Joi.date().iso().optional(),
  status: Joi.string().valid(...Object.values(TOURNAMENT_STATUS)).optional(),
  roomId: Joi.string().allow(null, '').optional(),
  roomPassword: Joi.string().allow(null, '').optional()
});

const updateRoomSchema = Joi.object({
  roomId: Joi.string().allow(null, '').required(),
  roomPassword: Joi.string().allow(null, '').required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(TOURNAMENT_STATUS)).required()
});

module.exports = {
  createTournamentSchema,
  updateTournamentSchema,
  updateRoomSchema,
  updateStatusSchema
};

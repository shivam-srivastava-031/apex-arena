const Joi = require('joi');
const { TOURNAMENT_MODES } = require('../constants/enums');

const teamMemberSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  bgmiId: Joi.string().min(3).max(60).required()
});

const createTeamSchema = Joi.object({
  tournamentId: Joi.string().hex().length(24).required(),
  mode: Joi.string().valid(...Object.values(TOURNAMENT_MODES)).required(),
  members: Joi.array().items(teamMemberSchema).required()
});

module.exports = {
  createTeamSchema
};

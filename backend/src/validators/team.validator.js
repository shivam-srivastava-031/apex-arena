const Joi = require('joi');
const { TOURNAMENT_MODES } = require('../constants/enums');

const teamMemberSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  bgmiId: Joi.string().min(3).max(60).required()
});

const createTeamSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  tag: Joi.string().trim().uppercase().min(2).max(5).required(),
  description: Joi.string().trim().max(300).allow('', null).optional(),
  members: Joi.array().items(teamMemberSchema).required()
});

const addTeamMemberSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  bgmiId: Joi.string().min(3).max(60).required()
});

module.exports = {
  createTeamSchema,
  addTeamMemberSchema
};

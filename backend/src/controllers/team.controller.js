const teamService = require('../services/team.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const createTeam = asyncHandler(async (req, res) => {
  const data = await teamService.createTeam(req.user, req.body);
  return ok(res, 'Team created successfully', data, 201);
});

const listTeams = asyncHandler(async (req, res) => {
  const data = await teamService.listTeams(req.query);
  return ok(res, 'Teams fetched successfully', data);
});

module.exports = {
  createTeam,
  listTeams
};

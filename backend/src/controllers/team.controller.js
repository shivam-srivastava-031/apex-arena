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

const getMyTeams = asyncHandler(async (req, res) => {
  const data = await teamService.listTeams({ leaderId: req.user.id });
  return ok(res, 'My Teams fetched successfully', data);
});

const getTeamById = asyncHandler(async (req, res) => {
  const data = await teamService.getTeamById(req.params.id);
  if (!data) return res.status(404).json({ success: false, error: 'Team not found' });
  return ok(res, 'Team fetched successfully', data);
});

const addMember = asyncHandler(async (req, res) => {
  const data = await teamService.addMember(req.params.id, req.user.id, req.body);
  return ok(res, 'Member added successfully', data);
});

const removeMember = asyncHandler(async (req, res) => {
  const data = await teamService.removeMember(req.params.id, req.user.id, req.params.memberId);
  return ok(res, 'Member removed successfully', data);
});

module.exports = {
  createTeam,
  listTeams,
  getMyTeams,
  getTeamById,
  addMember,
  removeMember
};

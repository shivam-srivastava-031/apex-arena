const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const listUsers = asyncHandler(async (_req, res) => {
  const data = await userService.listUsers();
  return ok(res, 'Users fetched successfully', data);
});

const updateBanStatus = asyncHandler(async (req, res) => {
  const data = await userService.banUser(req.params.id, req.body.isBanned);
  return ok(res, 'User ban status updated successfully', data);
});

module.exports = {
  listUsers,
  updateBanStatus
};

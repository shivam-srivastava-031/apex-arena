const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  return ok(res, 'User registered successfully', data, 201);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return ok(res, 'Login successful', data);
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.user.id);
  return ok(res, 'Profile fetched successfully', data);
});

module.exports = {
  register,
  login,
  me
};

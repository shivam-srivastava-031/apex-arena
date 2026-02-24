const resultService = require('../services/result.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const submitResult = asyncHandler(async (req, res) => {
  const data = await resultService.submitResult(req.body, req.user.id);
  return ok(res, 'Result submitted successfully', data, 201);
});

const listResults = asyncHandler(async (req, res) => {
  const data = await resultService.listResults(req.query);
  return ok(res, 'Results fetched successfully', data);
});

const updateResult = asyncHandler(async (req, res) => {
  const data = await resultService.updateResult(req.params.id, req.body);
  return ok(res, 'Result updated successfully', data);
});

const markWinner = asyncHandler(async (req, res) => {
  const data = await resultService.markWinner(req.params.id);
  return ok(res, 'Winner marked successfully', data);
});

module.exports = {
  submitResult,
  listResults,
  updateResult,
  markWinner
};

const Result = require('../models/Result');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const AppError = require('../utils/appError');

const submitResult = async (payload, userId) => {
  const registration = await Registration.findOne({
    userId,
    tournamentId: payload.tournamentId
  });

  if (!registration) {
    throw new AppError('You are not registered for this tournament', 403);
  }

  if (payload.teamId) {
    const team = await Team.findById(payload.teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    if (String(team.leaderId) !== String(userId)) {
      throw new AppError('Only team leader can submit team result', 403);
    }
  }

  const existingResult = await Result.findOne({
    tournamentId: payload.tournamentId,
    submittedBy: userId
  });

  if (existingResult) {
    throw new AppError('Result already submitted by this user for this tournament', 409);
  }

  return Result.create({
    ...payload,
    submittedBy: userId,
    verified: false,
    isWinner: false
  });
};

const listResults = async (filters = {}) => {
  const query = {};
  if (filters.tournamentId) {
    query.tournamentId = filters.tournamentId;
  }

  return Result.find(query)
    .populate('tournamentId', 'title mode status')
    .populate('teamId', 'mode members')
    .populate('submittedBy', 'name phone bgmiId')
    .sort({ createdAt: -1 });
};

const updateResult = async (id, payload) => {
  const result = await Result.findById(id);
  if (!result) {
    throw new AppError('Result not found', 404);
  }

  Object.assign(result, payload);
  await result.save();
  return result;
};

const markWinner = async (id) => {
  const result = await Result.findById(id);
  if (!result) {
    throw new AppError('Result not found', 404);
  }

  await Result.updateMany({ tournamentId: result.tournamentId }, { isWinner: false });
  result.isWinner = true;
  result.verified = true;
  await result.save();
  return result;
};

module.exports = {
  submitResult,
  listResults,
  updateResult,
  markWinner
};

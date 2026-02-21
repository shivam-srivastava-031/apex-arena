const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const AppError = require('../utils/appError');
const { TOURNAMENT_MODES } = require('../constants/enums');

const validateMembersByMode = (mode, members) => {
  if (mode === TOURNAMENT_MODES.SOLO && members.length !== 0) {
    throw new AppError('SOLO mode must not include teammates', 400);
  }

  if (mode === TOURNAMENT_MODES.DUO && members.length !== 1) {
    throw new AppError('DUO mode requires exactly 1 teammate', 400);
  }

  if (mode === TOURNAMENT_MODES.SQUAD && members.length !== 3) {
    throw new AppError('SQUAD mode requires exactly 3 teammates', 400);
  }
};

const createTeam = async (leader, payload) => {
  const tournament = await Tournament.findById(payload.tournamentId);
  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  if (tournament.mode !== payload.mode) {
    throw new AppError('Team mode must match tournament mode', 400);
  }

  validateMembersByMode(payload.mode, payload.members);

  const expectedTeamSize = payload.members.length + 1;
  if (expectedTeamSize !== tournament.teamSize) {
    throw new AppError(`Tournament allows teamSize ${tournament.teamSize} only`, 400);
  }

  const normalizedMembers = [
    {
      userId: leader.id,
      name: leader.name,
      bgmiId: leader.bgmiId
    },
    ...payload.members.map((member) => ({
      userId: null,
      name: member.name,
      bgmiId: member.bgmiId
    }))
  ];

  const duplicateBgmi = new Set(normalizedMembers.map((member) => member.bgmiId.toLowerCase()));
  if (duplicateBgmi.size !== normalizedMembers.length) {
    throw new AppError('Duplicate BGMI IDs are not allowed in the same team', 400);
  }

  const team = await Team.create({
    tournamentId: payload.tournamentId,
    leaderId: leader.id,
    mode: payload.mode,
    members: normalizedMembers,
    locked: false
  });

  return team;
};

const listTeams = async (filters = {}) => {
  const query = {};
  if (filters.tournamentId) {
    query.tournamentId = filters.tournamentId;
  }
  return Team.find(query).sort({ createdAt: -1 });
};

module.exports = {
  createTeam,
  listTeams
};

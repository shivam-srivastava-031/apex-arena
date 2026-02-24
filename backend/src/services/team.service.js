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
    name: payload.name,
    tag: payload.tag.toUpperCase(),
    description: payload.description || '',
    leaderId: leader.id,
    members: normalizedMembers,
    locked: false
  });

  return team;
};

const listTeams = async (filters = {}) => {
  const query = {};
  if (filters.leaderId) {
    query.leaderId = filters.leaderId;
  }
  return Team.find(query).sort({ createdAt: -1 });
};

const getTeamById = async (id) => {
  return Team.findById(id).populate('leaderId', 'username id');
};

const addMember = async (teamId, leaderId, memberData) => {
  const team = await Team.findOne({ _id: teamId, leaderId });
  if (!team) throw new AppError('Team not found or you are not the leader', 404);
  if (team.locked) throw new AppError('Team is locked and cannot be modified', 403);

  if (team.members.some(m => m.bgmiId.toLowerCase() === memberData.bgmiId.toLowerCase())) {
    throw new AppError('A member with this BGMI ID already exists in the team', 400);
  }

  // Assign user Id placeholder if it's the leader's own bgmi id (not standard but possible), otherwise null
  const newMember = {
    userId: null,
    name: memberData.name,
    bgmiId: memberData.bgmiId
  };

  team.members.push(newMember);
  await team.save();
  return team;
};

const removeMember = async (teamId, leaderId, memberId) => {
  const team = await Team.findOne({ _id: teamId, leaderId });
  if (!team) throw new AppError('Team not found or you are not the leader', 404);
  if (team.locked) throw new AppError('Team is locked and cannot be modified', 403);

  team.members = team.members.filter(m => m._id.toString() !== memberId.toString());
  await team.save();
  return team;
};

module.exports = {
  createTeam,
  listTeams,
  getTeamById,
  addMember,
  removeMember
};

const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const AppError = require('../utils/appError');
const { TOURNAMENT_STATUS, TOURNAMENT_MODES } = require('../constants/enums');

const validateTeamConfiguration = (payload) => {
  const mode = payload.mode;
  const teamSize = payload.teamSize;

  if (!mode || !teamSize) {
    return;
  }

  if (mode === TOURNAMENT_MODES.SOLO && teamSize !== 1) {
    throw new AppError('SOLO mode must have teamSize = 1', 400);
  }

  if (mode === TOURNAMENT_MODES.DUO && teamSize !== 2) {
    throw new AppError('DUO mode must have teamSize = 2', 400);
  }

  if (mode === TOURNAMENT_MODES.SQUAD && teamSize !== 4) {
    throw new AppError('SQUAD mode must have teamSize = 4', 400);
  }
};

const validateTournamentDates = (payload) => {
  const { registrationDeadline, startDateTime } = payload;
  if (!registrationDeadline || !startDateTime) {
    return;
  }

  if (new Date(registrationDeadline) >= new Date(startDateTime)) {
    throw new AppError('registrationDeadline must be earlier than startDateTime', 400);
  }
};

const createTournament = async (adminId, payload) => {
  validateTeamConfiguration(payload);
  validateTournamentDates(payload);
  return Tournament.create({ ...payload, createdBy: adminId });
};

const updateTournament = async (id, payload) => {
  const tournament = await Tournament.findById(id);
  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  if (payload.totalSlots && payload.totalSlots < tournament.filledSlots) {
    throw new AppError('totalSlots cannot be less than current filledSlots', 400);
  }

  const updatedPayload = {
    ...tournament.toObject(),
    ...payload
  };

  validateTeamConfiguration(updatedPayload);
  validateTournamentDates(updatedPayload);

  Object.assign(tournament, payload);
  await tournament.save();
  return tournament;
};

const deleteTournament = async (id) => {
  const tournament = await Tournament.findByIdAndDelete(id);
  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }
};

const listTournaments = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.mode) {
    query.mode = filters.mode;
  }

  return Tournament.find(query).sort({ createdAt: -1 });
};

const listPublishedTournaments = async () => {
  return Tournament.find({ status: TOURNAMENT_STATUS.PUBLISHED }).sort({ createdAt: -1 });
};

const getTournamentById = async (id) => {
  const tournament = await Tournament.findById(id);
  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }
  return tournament;
};

const updateRoomCredentials = async (id, payload) => {
  return updateTournament(id, payload);
};

const updateStatus = async (id, status) => {
  if (!Object.values(TOURNAMENT_STATUS).includes(status)) {
    throw new AppError('Invalid tournament status', 400);
  }
  return updateTournament(id, { status });
};

const getRoomAccess = async (userId, tournamentId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  if (tournament.status !== TOURNAMENT_STATUS.LIVE) {
    throw new AppError('Room details are only available when tournament is LIVE', 403);
  }

  const registration = await Registration.findOne({ userId, tournamentId });
  if (!registration) {
    throw new AppError('You are not registered for this tournament', 403);
  }

  return {
    tournamentId: tournament._id,
    roomId: tournament.roomId,
    roomPassword: tournament.roomPassword
  };
};

const listTournamentEntries = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  return Registration.find({ tournamentId })
    .populate('userId', 'name phone bgmiId')
    .populate('teamId', 'mode members locked')
    .populate('paymentId', 'amount status providerTransactionId paidAt')
    .sort({ createdAt: -1 });
};

module.exports = {
  createTournament,
  updateTournament,
  deleteTournament,
  listTournaments,
  listPublishedTournaments,
  getTournamentById,
  updateRoomCredentials,
  updateStatus,
  getRoomAccess,
  listTournamentEntries
};

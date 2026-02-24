const tournamentService = require('../services/tournament.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const createTournament = asyncHandler(async (req, res) => {
  const data = await tournamentService.createTournament(req.user.id, req.body);
  return ok(res, 'Tournament created successfully', data, 201);
});

const updateTournament = asyncHandler(async (req, res) => {
  const data = await tournamentService.updateTournament(req.params.id, req.body);
  return ok(res, 'Tournament updated successfully', data);
});

const deleteTournament = asyncHandler(async (req, res) => {
  await tournamentService.deleteTournament(req.params.id);
  return ok(res, 'Tournament deleted successfully');
});

const listTournaments = asyncHandler(async (req, res) => {
  const data = await tournamentService.listTournaments(req.query);
  return ok(res, 'Tournaments fetched successfully', data);
});

const listPublishedTournaments = asyncHandler(async (_req, res) => {
  const data = await tournamentService.listPublishedTournaments();
  return ok(res, 'Published tournaments fetched successfully', data);
});

const getTournamentById = asyncHandler(async (req, res) => {
  const data = await tournamentService.getTournamentById(req.params.id);
  return ok(res, 'Tournament fetched successfully', data);
});

const updateRoom = asyncHandler(async (req, res) => {
  const data = await tournamentService.updateRoomCredentials(req.params.id, req.body);
  return ok(res, 'Room credentials updated successfully', data);
});

const updateStatus = asyncHandler(async (req, res) => {
  const data = await tournamentService.updateStatus(req.params.id, req.body.status);
  return ok(res, 'Tournament status updated successfully', data);
});

const roomAccess = asyncHandler(async (req, res) => {
  const data = await tournamentService.getRoomAccess(req.user.id, req.params.id);
  return ok(res, 'Room details fetched successfully', data);
});

const tournamentEntries = asyncHandler(async (req, res) => {
  const data = await tournamentService.listTournamentEntries(req.params.id);
  return ok(res, 'Tournament entries fetched successfully', data);
});

const getBracket = asyncHandler(async (req, res) => {
  const bracket = await tournamentService.getBracket(req.params.id);
  return ok(res, 'Bracket fetched successfully', bracket);
});

module.exports = {
  createTournament,
  updateTournament,
  deleteTournament,
  listTournaments,
  listPublishedTournaments,
  getTournamentById,
  updateRoom,
  updateStatus,
  roomAccess,
  tournamentEntries,
  getBracket
};

const express = require('express');
const tournamentController = require('../controllers/tournament.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');
const {
  createTournamentSchema,
  updateTournamentSchema,
  updateRoomSchema,
  updateStatusSchema
} = require('../validators/tournament.validator');

const router = express.Router();

router.get('/', tournamentController.listTournaments);
router.get('/published/list', tournamentController.listPublishedTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.get('/:id/room-access', authenticate, tournamentController.roomAccess);
router.get('/:id/entries', authenticate, authorize(ROLES.ADMIN), tournamentController.tournamentEntries);

router.post('/', authenticate, authorize(ROLES.ADMIN), validate(createTournamentSchema), tournamentController.createTournament);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), validate(updateTournamentSchema), tournamentController.updateTournament);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), tournamentController.deleteTournament);
router.patch('/:id/room', authenticate, authorize(ROLES.ADMIN), validate(updateRoomSchema), tournamentController.updateRoom);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN), validate(updateStatusSchema), tournamentController.updateStatus);

module.exports = router;

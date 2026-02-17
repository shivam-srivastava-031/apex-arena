const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

// Get all tournaments
router.get('/', tournamentController.getAllTournaments);

// Get tournament by ID
router.get('/:id', tournamentController.getTournamentById);

// Create new tournament
router.post('/', tournamentController.createTournament);

// Update tournament
router.put('/:id', tournamentController.updateTournament);

// Delete tournament
router.delete('/:id', tournamentController.deleteTournament);

// Join tournament
router.post('/:id/join', tournamentController.joinTournament);

module.exports = router;

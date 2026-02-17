const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');

// Get all teams (public)
router.get('/', teamController.getAllTeams);

// Get team by ID (public)
router.get('/:id', teamController.getTeamById);

// Protected routes (require authentication)
router.use(auth);

// Create new team
router.post('/', teamController.createTeam);

// Update team
router.put('/:id', teamController.updateTeam);

// Delete team
router.delete('/:id', teamController.deleteTeam);

// Join team
router.post('/:id/join', teamController.joinTeam);

// Leave team
router.post('/:id/leave', teamController.leaveTeam);

module.exports = router;

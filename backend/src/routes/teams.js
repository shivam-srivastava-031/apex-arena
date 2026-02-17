const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Get all teams
router.get('/', teamController.getAllTeams);

// Get team by ID
router.get('/:id', teamController.getTeamById);

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

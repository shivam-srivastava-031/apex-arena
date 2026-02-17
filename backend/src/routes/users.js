const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Get user stats
router.get('/stats', userController.getUserStats);

// Get user teams
router.get('/teams', userController.getUserTeams);

// Get user tournaments
router.get('/tournaments', userController.getUserTournaments);

module.exports = router;

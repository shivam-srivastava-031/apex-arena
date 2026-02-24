const express = require('express');
const authRoutes = require('./auth.routes');
const tournamentRoutes = require('./tournament.routes');
const teamRoutes = require('./team.routes');
const registrationRoutes = require('./registration.routes');
const resultRoutes = require('./result.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/teams', teamRoutes);
router.use('/registrations', registrationRoutes);
router.use('/results', resultRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;

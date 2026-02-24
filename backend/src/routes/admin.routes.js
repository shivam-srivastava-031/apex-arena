const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');

const router = express.Router();

router.get('/stats', authenticate, authorize(ROLES.ADMIN), adminController.getStats);

module.exports = router;

const express = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');
const { banUserSchema } = require('../validators/user.validator');

const router = express.Router();

router.get('/', authenticate, authorize(ROLES.ADMIN), userController.listUsers);
router.patch('/:id/ban', authenticate, authorize(ROLES.ADMIN), validate(banUserSchema), userController.updateBanStatus);

module.exports = router;

const express = require('express');
const teamController = require('../controllers/team.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');
const { createTeamSchema } = require('../validators/team.validator');

const router = express.Router();

router.get('/', authenticate, authorize(ROLES.ADMIN), teamController.listTeams);
router.post('/', authenticate, authorize(ROLES.USER, ROLES.ADMIN), validate(createTeamSchema), teamController.createTeam);

module.exports = router;

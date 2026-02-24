const express = require('express');
const teamController = require('../controllers/team.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');
const { createTeamSchema, addTeamMemberSchema } = require('../validators/team.validator');

const router = express.Router();

router.get('/', authenticate, authorize(ROLES.ADMIN), teamController.listTeams);
router.get('/my', authenticate, authorize(ROLES.USER, ROLES.ADMIN), teamController.getMyTeams);
router.get('/:id', authenticate, teamController.getTeamById);
router.post('/', authenticate, authorize(ROLES.USER, ROLES.ADMIN), validate(createTeamSchema), teamController.createTeam);
router.post('/:id/members', authenticate, validate(addTeamMemberSchema), teamController.addMember);
router.delete('/:id/members/:memberId', authenticate, teamController.removeMember);

module.exports = router;

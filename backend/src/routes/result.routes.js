const express = require('express');
const resultController = require('../controllers/result.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');
const { submitResultSchema, updateResultSchema, markWinnerSchema } = require('../validators/result.validator');

const router = express.Router();

router.post('/', authenticate, authorize(ROLES.USER, ROLES.ADMIN), validate(submitResultSchema), resultController.submitResult);
router.get('/', authenticate, authorize(ROLES.ADMIN), resultController.listResults);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), validate(updateResultSchema), resultController.updateResult);
router.patch('/:id/winner', authenticate, authorize(ROLES.ADMIN), validate(markWinnerSchema), resultController.markWinner);

module.exports = router;

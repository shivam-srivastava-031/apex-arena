const express = require('express');
const registrationController = require('../controllers/registration.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/enums');
const { initiateBookingSchema, confirmPaymentSchema } = require('../validators/registration.validator');

const router = express.Router();

router.post('/book-slot', authenticate, authorize(ROLES.USER, ROLES.ADMIN), validate(initiateBookingSchema), registrationController.initiateBooking);
router.post('/confirm-payment', authenticate, authorize(ROLES.USER, ROLES.ADMIN), validate(confirmPaymentSchema), registrationController.confirmBookingPayment);
router.get('/my', authenticate, authorize(ROLES.USER, ROLES.ADMIN), registrationController.listMyRegistrations);
router.get('/', authenticate, authorize(ROLES.ADMIN), registrationController.listRegistrations);

module.exports = router;

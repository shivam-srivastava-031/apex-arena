const registrationService = require('../services/registration.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const initiateBooking = asyncHandler(async (req, res) => {
  const data = await registrationService.initiateBooking({
    userId: req.user.id,
    tournamentId: req.body.tournamentId,
    selectedTeamSize: req.body.selectedTeamSize,
    players: req.body.players,
    metadata: req.body.metadata || {}
  });

  return ok(res, 'Booking initiated successfully', data, 201);
});

const confirmBookingPayment = asyncHandler(async (req, res) => {
  const data = await registrationService.confirmBookingPayment({
    userId: req.user.id,
    paymentId: req.body.paymentId,
    paymentStatus: req.body.paymentStatus,
    providerTransactionId: req.body.providerTransactionId,
    metadata: req.body.metadata || {}
  });

  return ok(res, 'Payment processed and registration updated', data);
});

const listMyRegistrations = asyncHandler(async (req, res) => {
  const data = await registrationService.listMyRegistrations(req.user.id);
  return ok(res, 'My registrations fetched successfully', data);
});

const listRegistrations = asyncHandler(async (req, res) => {
  const data = await registrationService.listRegistrations(req.query);
  return ok(res, 'Registrations fetched successfully', data);
});

module.exports = {
  initiateBooking,
  confirmBookingPayment,
  listMyRegistrations,
  listRegistrations
};

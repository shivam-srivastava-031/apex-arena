const mongoose = require('mongoose');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Payment = require('../models/Payment');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const env = require('../config/env');
const { TOURNAMENT_MODES, TOURNAMENT_STATUS, PAYMENT_STATUS } = require('../constants/enums');

const validateBookingEligibility = ({ tournament, user }) => {
  if (user.isBanned) {
    throw new AppError('Banned users cannot book tournaments', 403);
  }

  if (![TOURNAMENT_STATUS.PUBLISHED, TOURNAMENT_STATUS.LIVE].includes(tournament.status)) {
    throw new AppError('Tournament is not open for booking', 400);
  }

  if (new Date() > new Date(tournament.registrationDeadline)) {
    throw new AppError('Registration deadline has passed', 400);
  }

  if (tournament.filledSlots >= tournament.totalSlots) {
    throw new AppError('Tournament slots are full', 409);
  }
};

const validateTeamSelection = ({ tournament, selectedTeamSize, players }) => {
  if (selectedTeamSize !== players.length) {
    throw new AppError('selectedTeamSize must match number of players', 400);
  }

  if (selectedTeamSize !== tournament.teamSize) {
    throw new AppError(`Tournament allows teamSize ${tournament.teamSize} only`, 400);
  }

  if (tournament.mode === TOURNAMENT_MODES.SOLO && selectedTeamSize !== 1) {
    throw new AppError('SOLO tournament allows only 1 player', 400);
  }

  if (tournament.mode === TOURNAMENT_MODES.DUO && selectedTeamSize !== 2) {
    throw new AppError('DUO tournament allows only 2 players', 400);
  }

  if (tournament.mode === TOURNAMENT_MODES.SQUAD && selectedTeamSize !== 4) {
    throw new AppError('SQUAD tournament allows only 4 players', 400);
  }
};

const initiateBooking = async ({ userId, tournamentId, selectedTeamSize, players, metadata = {} }) => {
  const [user, tournament] = await Promise.all([
    User.findById(userId),
    Tournament.findById(tournamentId)
  ]);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  validateBookingEligibility({ tournament, user });
  validateTeamSelection({ tournament, selectedTeamSize, players });

  const duplicateRegistration = await Registration.findOne({ userId, tournamentId });
  if (duplicateRegistration) {
    throw new AppError('Duplicate registration is not allowed', 409);
  }

  const existingPendingPayment = await Payment.findOne({
    userId,
    tournamentId,
    status: PAYMENT_STATUS.INITIATED
  });

  if (existingPendingPayment) {
    throw new AppError('A booking payment is already initiated for this tournament', 409);
  }

  const duplicateBgmiIds = new Set(players.map((player) => player.bgmiId.toLowerCase()));
  if (duplicateBgmiIds.size !== players.length) {
    throw new AppError('Duplicate BGMI IDs are not allowed within a team', 400);
  }

  const team = await Team.create({
    tournamentId,
    leaderId: userId,
    members: players.map((member) => ({
      userId: String(member.bgmiId).toLowerCase() === String(user.bgmiId).toLowerCase() ? userId : null,
      name: member.name,
      bgmiId: member.bgmiId
    })),
    mode: tournament.mode,
    locked: false
  });

  const payment = await Payment.create({
    userId,
    tournamentId,
    teamId: team._id,
    amount: tournament.entryFee,
    currency: 'INR',
    status: PAYMENT_STATUS.INITIATED,
    metadata
  });

  // If entry fee is 0, we can bypass Razorpay order generation
  if (tournament.entryFee === 0) {
    return {
      paymentId: payment._id,
      amount: 0,
      currency: payment.currency,
      paymentStatus: payment.status,
      message: 'Free tournament registration initiated'
    };
  }

  // Generate Razorpay Order
  const razorpayOptions = {
    amount: payment.amount * 100, // paise
    currency: payment.currency,
    receipt: `receipt_${payment._id}`
  };

  try {
    const order = await razorpay.orders.create(razorpayOptions);

    // Save provider id for tracking
    payment.providerTransactionId = order.id;
    await payment.save();

    return {
      paymentId: payment._id,
      razorpayOrderId: order.id,
      amount: payment.amount,
      currency: payment.currency,
      paymentStatus: payment.status,
      message: 'Proceed to payment with Razorpay'
    };
  } catch (err) {
    console.error('Razorpay Error:', err);
    throw new AppError('Failed to generate payment order', 500);
  }
};

const confirmBookingPayment = async ({ userId, paymentId, paymentStatus, providerTransactionId, metadata = {} }) => {
  if (paymentStatus === PAYMENT_STATUS.FAILED) {
    const payment = await Payment.findOne({ _id: paymentId, userId });
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    payment.status = PAYMENT_STATUS.FAILED;
    payment.providerTransactionId = providerTransactionId || null;
    payment.metadata = { ...payment.metadata, ...metadata };
    await payment.save();
    return payment;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
      status: PAYMENT_STATUS.INITIATED
    }).session(session);

    if (!payment) {
      throw new AppError('No initiated payment found for this user', 404);
    }

    // Razorpay signature verification
    if (payment.amount > 0 && metadata.razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', env.razorpayKeySecret)
        .update(payment.providerTransactionId + '|' + providerTransactionId)
        .digest('hex');

      if (generatedSignature !== metadata.razorpay_signature) {
        throw new AppError('Invalid payment signature', 400);
      }
    }

    const [user, tournament, duplicateRegistration] = await Promise.all([
      User.findById(userId).session(session),
      Tournament.findById(payment.tournamentId).session(session),
      Registration.findOne({ userId, tournamentId: payment.tournamentId }).session(session)
    ]);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!tournament) {
      throw new AppError('Tournament not found', 404);
    }

    validateBookingEligibility({ tournament, user });

    if (duplicateRegistration) {
      throw new AppError('Duplicate registration is not allowed', 409);
    }

    const team = payment.teamId ? await Team.findById(payment.teamId).session(session) : null;

    if (!team) {
      throw new AppError('Linked booking team not found', 404);
    }

    if (team.locked) {
      throw new AppError('Team is already locked/registered', 409);
    }

    const existingTeamRegistration = await Registration.findOne({
      tournamentId: payment.tournamentId,
      teamId: team._id
    }).session(session);

    if (existingTeamRegistration) {
      throw new AppError('Team already registered in this tournament', 409);
    }

    tournament.filledSlots += 1;
    await tournament.save({ session });

    const registration = await Registration.create(
      [
        {
          userId,
          tournamentId: payment.tournamentId,
          teamId: team._id,
          paymentId: payment._id,
          registeredAt: new Date()
        }
      ],
      { session }
    );

    team.locked = true;
    await team.save({ session });

    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.providerTransactionId = providerTransactionId || null;
    payment.paidAt = new Date();
    payment.metadata = { ...payment.metadata, ...metadata };
    await payment.save({ session });

    await session.commitTransaction();
    return registration[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const listMyRegistrations = async (userId) => {
  return Registration.find({ userId })
    .populate('tournamentId', 'title gameName mode teamSize status startDateTime registrationDeadline endDate prizePool filledSlots totalSlots entryFee description')
    .populate('teamId', 'members mode locked')
    .populate('paymentId', 'amount currency status providerTransactionId paidAt')
    .sort({ createdAt: -1 });
};

const listRegistrations = async (filters = {}) => {
  const query = {};
  if (filters.tournamentId) {
    query.tournamentId = filters.tournamentId;
  }
  if (filters.userId) {
    query.userId = filters.userId;
  }

  return Registration.find(query)
    .populate('userId', 'name phone bgmiId role isBanned')
    .populate('tournamentId', 'title mode status')
    .populate('teamId', 'mode locked members')
    .sort({ registeredAt: -1 });
};

module.exports = {
  initiateBooking,
  confirmBookingPayment,
  listMyRegistrations,
  listRegistrations
};

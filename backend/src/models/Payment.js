const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['INITIATED', 'SUCCESS', 'FAILED'],
      default: 'INITIATED'
    },
    paymentProvider: {
      type: String,
      default: 'MANUAL'
    },
    providerTransactionId: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

paymentSchema.index({ userId: 1, tournamentId: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);

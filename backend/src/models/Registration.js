const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
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
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

registrationSchema.index({ userId: 1, tournamentId: 1 }, { unique: true });
registrationSchema.index({ tournamentId: 1, teamId: 1 }, { unique: true, sparse: true });
registrationSchema.index({ paymentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

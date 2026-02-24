const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
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
    position: {
      type: Number,
      required: true,
      min: 1
    },
    screenshotUrl: {
      type: String,
      required: true,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    isWinner: {
      type: Boolean,
      default: false
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

resultSchema.index({ tournamentId: 1, teamId: 1 }, { unique: true, sparse: true });
resultSchema.index({ tournamentId: 1, submittedBy: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Result', resultSchema);

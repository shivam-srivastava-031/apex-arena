const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    bgmiId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    }
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: {
      type: [teamMemberSchema],
      required: true,
      default: []
    },
    mode: {
      type: String,
      enum: ['SOLO', 'DUO', 'SQUAD', 'CUSTOM'],
      required: true
    },
    locked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

teamSchema.index({ tournamentId: 1, leaderId: 1 });

module.exports = mongoose.model('Team', teamSchema);

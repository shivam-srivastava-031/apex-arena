const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    gameName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    mode: {
      type: String,
      enum: ['SOLO', 'DUO', 'SQUAD', 'CUSTOM'],
      required: true
    },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1
    },
    filledSlots: {
      type: Number,
      default: 0,
      min: 0
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'LIVE', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT'
    },
    startDateTime: {
      type: Date,
      required: true
    },
    registrationDeadline: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    roomId: {
      type: String,
      default: null
    },
    roomPassword: {
      type: String,
      default: null
    },
    createdBy: {
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

tournamentSchema.index({ status: 1, registrationDeadline: 1, createdAt: -1 });

module.exports = mongoose.model('Tournament', tournamentSchema);

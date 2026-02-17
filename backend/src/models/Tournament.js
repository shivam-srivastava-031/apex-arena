const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  game: {
    type: String,
    required: true,
    enum: ['Apex Legends', 'BGMI', 'PUBG', 'Call of Duty', 'Valorant', 'CS:GO']
  },
  format: {
    type: String,
    enum: ['Solo', 'Duo', 'Squad', 'Custom'],
    default: 'Squad'
  },
  maxTeams: {
    type: Number,
    required: true,
    min: 2,
    max: 256
  },
  entryFee: {
    type: Number,
    default: 0
  },
  prizePool: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'INR', 'EUR'],
    default: 'USD'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationStart: {
    type: Date,
    default: Date.now
  },
  registrationEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Registration', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Registered', 'Confirmed', 'Eliminated', 'Winner'],
      default: 'Registered'
    }
  }],
  prizeDistribution: [{
    position: {
      type: String,
      required: true
    },
    prize: {
      type: Number,
      required: true
    }
  }],
  rules: [{
    type: String,
    maxlength: 500
  }],
  banner: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Get participant count
tournamentSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Check if registration is open
tournamentSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return this.status === 'Registration' && 
         now >= this.registrationStart && 
         now <= this.registrationEnd;
});

// Check if tournament is full
tournamentSchema.virtual('isFull').get(function() {
  return this.participants.length >= this.maxTeams;
});

module.exports = mongoose.model('Tournament', tournamentSchema);

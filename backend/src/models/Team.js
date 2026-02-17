const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  tag: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 10
  },
  description: {
    type: String,
    maxlength: 500
  },
  logo: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['Leader', 'Co-Leader', 'Member', 'Substitute'],
      default: 'Member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxMembers: {
    type: Number,
    default: 4
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    tournamentsWon: { type: Number, default: 0 },
    tournamentsPlayed: { type: Number, default: 0 },
    totalWinnings: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Ensure team leader is in members
teamSchema.pre('save', function(next) {
  if (this.isNew && this.createdBy) {
    const existingLeader = this.members.find(member => 
      member.user.toString() === this.createdBy.toString()
    );
    
    if (!existingLeader) {
      this.members.push({
        user: this.createdBy,
        role: 'Leader',
        joinedAt: new Date()
      });
    }
  }
  next();
});

// Get member count
teamSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Check if user is member
teamSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString()
  );
};

// Get user role in team
teamSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

module.exports = mongoose.model('Team', teamSchema);

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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    tag: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 5
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ''
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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

teamSchema.index({ leaderId: 1 });
teamSchema.index({ tag: 1 }, { unique: true }); // Adding uniqueness for tags

module.exports = mongoose.model('Team', teamSchema);

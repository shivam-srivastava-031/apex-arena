const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    bgmiId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    ffId: {
      type: String,
      trim: true
    },
    dob: {
      type: Date
    },
    avatar_url: {
      type: String
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER'
    },
    isBanned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre('save', async function saveHook(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

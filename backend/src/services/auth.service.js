const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const AppError = require('../utils/appError');

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

const register = async (payload) => {
  const existingPhone = await User.findOne({ phone: payload.phone });
  if (existingPhone) {
    throw new AppError('Phone already registered', 409);
  }

  const existingBgmi = await User.findOne({ bgmiId: payload.bgmiId });
  if (existingBgmi) {
    throw new AppError('BGMI ID already registered', 409);
  }

  const user = await User.create({
    name: payload.name,
    phone: payload.phone,
    bgmiId: payload.bgmiId,
    password: payload.password,
    role: 'USER'
  });
  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      bgmiId: user.bgmiId,
      role: user.role,
      isBanned: user.isBanned
    }
  };
};

const login = async ({ phone, password }) => {
  const user = await User.findOne({ phone }).select('+password');

  if (!user) {
    throw new AppError('Invalid phone or password', 401);
  }

  if (user.isBanned) {
    throw new AppError('Your account is banned', 403);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid phone or password', 401);
  }

  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      bgmiId: user.bgmiId,
      role: user.role,
      isBanned: user.isBanned
    }
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    bgmiId: user.bgmiId,
    role: user.role,
    isBanned: user.isBanned,
    createdAt: user.createdAt
  };
};

module.exports = {
  register,
  login,
  getMe
};

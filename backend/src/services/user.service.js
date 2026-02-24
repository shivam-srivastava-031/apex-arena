const User = require('../models/User');
const AppError = require('../utils/appError');

const listUsers = async () => User.find().sort({ createdAt: -1 });

const banUser = async (userId, isBanned) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isBanned = isBanned;
  await user.save();

  return user;
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const allowedFields = ['name', 'email', 'phone', 'bgmiId', 'ffId', 'dob', 'avatar_url'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  await user.save();
  return user;
};

module.exports = {
  listUsers,
  banUser,
  getProfile,
  updateProfile
};

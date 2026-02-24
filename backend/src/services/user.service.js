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

module.exports = {
  listUsers,
  banUser
};

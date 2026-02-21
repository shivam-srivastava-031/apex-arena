const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const AppError = require('../utils/appError');

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: token missing', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).select('+password');

    if (!user) {
      return next(new AppError('Unauthorized: user not found', 401));
    }

    if (user.isBanned) {
      return next(new AppError('Your account is banned', 403));
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      phone: user.phone,
      bgmiId: user.bgmiId
    };

    return next();
  } catch (error) {
    return next(new AppError('Unauthorized: invalid or expired token', 401));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Forbidden: insufficient role', 403));
  }

  return next();
};

module.exports = {
  authenticate,
  authorize
};

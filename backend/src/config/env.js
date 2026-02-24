const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-arena',
  mongoUriFallback: process.env.MONGODB_URI_FALLBACK || '',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || process.env.FRONTEND_URL || '*',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 200),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
};

module.exports = env;

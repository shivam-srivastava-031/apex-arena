const Razorpay = require('razorpay');
const env = require('./env');

const razorpayInstance = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

module.exports = razorpayInstance;

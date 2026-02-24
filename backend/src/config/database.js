const mongoose = require('mongoose');

let isConnected = false;

const connectDatabase = async (mongoUri) => {
  if (isConnected) {
    return mongoose.connection;
  }

  const connection = await mongoose.connect(mongoUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  });

  isConnected = true;
  return connection.connection;
};

module.exports = { connectDatabase };

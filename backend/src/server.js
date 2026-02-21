const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');

const bootstrap = async () => {
  let databaseConnected = false;

  try {
    await connectDatabase(env.mongoUri);
    databaseConnected = true;
  } catch (error) {
    const canFallback = env.nodeEnv !== 'production' && env.mongoUriFallback;

    console.warn(`Primary MongoDB connection failed: ${error.message}`);

    if (canFallback) {
      try {
        console.warn(`Retrying with fallback MongoDB URI: ${env.mongoUriFallback}`);
        await connectDatabase(env.mongoUriFallback);
        databaseConnected = true;
      } catch (fallbackError) {
        console.warn(`Fallback MongoDB connection failed: ${fallbackError.message}`);
      }
    }
  }

  app.locals.databaseConnected = databaseConnected;

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
    if (!databaseConnected) {
      console.warn('Server is running in degraded mode (database unavailable).');
    }
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

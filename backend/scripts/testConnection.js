const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('Testing MongoDB connection...\n');
  
  try {
    // Test connection
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-arena';
    console.log(`Connecting to: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection successful\n');
    
    // Test database operations
    const db = mongoose.connection;
    console.log(`Database Name: ${db.name}`);
    console.log(`Host: ${db.host}`);
    console.log(`Port: ${db.port}\n`);
    
    // Test collections
    const collections = await db.db.listCollections().toArray();
    console.log(`Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('Collection Names:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    } else {
      console.log('No collections found. Run "npm run init-db" to create sample data.');
    }
    
    // Test model operations (if collections exist)
    try {
      const User = require('../src/models/User');
      const userCount = await User.countDocuments();
      console.log(`\nUsers in database: ${userCount}`);
      
      if (userCount > 0) {
        const sampleUser = await User.findOne().select('name phone role isBanned');
        console.log('Sample User:', {
          name: sampleUser.name,
          phone: sampleUser.phone,
          role: sampleUser.role,
          isBanned: sampleUser.isBanned
        });
      }
    } catch (error) {
      console.log('User model not tested (collection may not exist)');
    }
    
    try {
      const Team = require('../src/models/Team');
      const teamCount = await Team.countDocuments();
      console.log(`\nTeams in database: ${teamCount}`);
    } catch (error) {
      console.log('Team model not tested (collection may not exist)');
    }
    
    try {
      const Tournament = require('../src/models/Tournament');
      const tournamentCount = await Tournament.countDocuments();
      console.log(`\nTournaments in database: ${tournamentCount}`);
    } catch (error) {
      console.log('Tournament model not tested (collection may not exist)');
    }

    console.log('\nAll tests completed successfully');
    
  } catch (error) {
    console.error('MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\nTroubleshooting tips:');
      console.log('1. Ensure MongoDB is running (mongod)');
      console.log('2. Check connection string in .env file');
      console.log('3. Verify MongoDB is accessible on the specified port');
      console.log('4. For MongoDB Atlas, check IP whitelist and network access');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
};

// Run test if called directly
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;

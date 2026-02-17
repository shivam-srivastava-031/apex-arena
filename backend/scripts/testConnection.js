const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  try {
    // Test connection
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apex-arena';
    console.log(`📍 Connecting to: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connection Successful!\n');
    
    // Test database operations
    const db = mongoose.connection;
    console.log(`📊 Database Name: ${db.name}`);
    console.log(`🖥️  Host: ${db.host}`);
    console.log(`🔌 Port: ${db.port}\n`);
    
    // Test collections
    const collections = await db.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Collection Names:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    } else {
      console.log('📋 No collections found. Run "npm run init-db" to create sample data.');
    }
    
    // Test model operations (if collections exist)
    try {
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      console.log(`\n👥 Users in database: ${userCount}`);
      
      if (userCount > 0) {
        const sampleUser = await User.findOne().select('username email level rank');
        console.log('📝 Sample User:', {
          username: sampleUser.username,
          email: sampleUser.email,
          level: sampleUser.level,
          rank: sampleUser.rank
        });
      }
    } catch (error) {
      console.log('ℹ️  User model not tested (collection may not exist)');
    }
    
    try {
      const Team = require('../models/Team');
      const teamCount = await Team.countDocuments();
      console.log(`\n🏆 Teams in database: ${teamCount}`);
    } catch (error) {
      console.log('ℹ️  Team model not tested (collection may not exist)');
    }
    
    try {
      const Tournament = require('../models/Tournament');
      const tournamentCount = await Tournament.countDocuments();
      console.log(`\n🎮 Tournaments in database: ${tournamentCount}`);
    } catch (error) {
      console.log('ℹ️  Tournament model not tested (collection may not exist)');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Ensure MongoDB is running (mongod)');
      console.log('2. Check connection string in .env file');
      console.log('3. Verify MongoDB is accessible on the specified port');
      console.log('4. For MongoDB Atlas, check IP whitelist and network access');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n📴 Connection closed');
  }
};

// Run test if called directly
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Team = require('../src/models/Team');
const Tournament = require('../src/models/Tournament');
const Registration = require('../src/models/Registration');
const Result = require('../src/models/Result');
const Payment = require('../src/models/Payment');

const initializeDatabase = async () => {
  try {
    console.log('Initializing Apex Arena database...');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-arena');

    console.log('Cleaning existing data...');
    await Result.deleteMany({});
    await Registration.deleteMany({});
    await Payment.deleteMany({});
    await User.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});

    console.log('Creating sample users...');
    const sampleUsers = await User.insertMany([
      {
        name: 'Admin User',
        phone: '9999999999',
        bgmiId: 'ADMIN_BGMI_01',
        password: 'password123',
        role: 'ADMIN'
      },
      {
        name: 'Player One',
        phone: '8888888888',
        bgmiId: 'PLAYER_BGMI_01',
        password: 'password123',
        role: 'USER'
      },
      {
        name: 'Player Two',
        phone: '7777777777',
        bgmiId: 'PLAYER_BGMI_02',
        password: 'password123',
        role: 'USER'
      }
    ]);

    console.log('Creating sample tournaments...');
    const sampleTournaments = await Tournament.insertMany([
      {
        title: 'Apex Arena Duo Clash',
        gameName: 'BGMI',
        mode: 'DUO',
        teamSize: 2,
        entryFee: 100,
        totalSlots: 50,
        filledSlots: 0,
        prizePool: 20000,
        status: 'PUBLISHED',
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        createdBy: sampleUsers[0]._id
      },
      {
        title: 'Apex Arena Solo Sprint',
        gameName: 'Valorant',
        mode: 'SOLO',
        teamSize: 1,
        entryFee: 0,
        totalSlots: 100,
        filledSlots: 0,
        prizePool: 5000,
        status: 'DRAFT',
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
        createdBy: sampleUsers[0]._id
      }
    ]);

    console.log('Creating sample team...');
    await Team.create({
      tournamentId: sampleTournaments[0]._id,
      leaderId: sampleUsers[1]._id,
      mode: 'DUO',
      locked: false,
      members: [
        {
          userId: sampleUsers[1]._id,
          name: sampleUsers[1].name,
          bgmiId: sampleUsers[1].bgmiId
        },
        {
          userId: null,
          name: 'Manual Teammate',
          bgmiId: 'DUO_TEAMMATE_01'
        }
      ]
    });

    console.log('Database initialization complete');
    console.log('Admin login phone: 9999999999 / password: password123');
    console.log('User login phone: 8888888888 / password: password123');
    console.log('User login phone: 7777777777 / password: password123');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

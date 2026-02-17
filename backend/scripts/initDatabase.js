const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');

const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing Apex Arena Database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex-arena');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (for fresh start)
    console.log('🧹 Cleaning existing data...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});
    console.log('✅ Database cleaned');

    // Create sample users
    console.log('👥 Creating sample users...');
    const sampleUsers = [
      {
        username: 'ApexLegend',
        email: 'legend@apexarena.com',
        password: 'password123',
        level: 25,
        rank: 'Diamond',
        stats: {
          wins: 150,
          losses: 50,
          kills: 2450,
          deaths: 1200,
          assists: 800
        }
      },
      {
        username: 'ProGamer',
        email: 'pro@apexarena.com',
        password: 'password123',
        level: 18,
        rank: 'Platinum',
        stats: {
          wins: 85,
          losses: 40,
          kills: 1200,
          deaths: 800,
          assists: 450
        }
      },
      {
        username: 'NewPlayer',
        email: 'newbie@apexarena.com',
        password: 'password123',
        level: 5,
        rank: 'Bronze',
        stats: {
          wins: 10,
          losses: 20,
          kills: 150,
          deaths: 200,
          assists: 50
        }
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Create sample teams
    console.log('🏆 Creating sample teams...');
    const sampleTeams = [
      {
        name: 'Elite Squad',
        tag: 'ELITE',
        description: 'Professional gaming team competing in major tournaments',
        createdBy: createdUsers[0]._id,
        members: [
          { user: createdUsers[0]._id, role: 'Leader' },
          { user: createdUsers[1]._id, role: 'Co-Leader' }
        ],
        maxMembers: 4,
        stats: {
          tournamentsWon: 3,
          tournamentsPlayed: 8,
          totalWinnings: 15000
        }
      },
      {
        name: 'Rising Stars',
        tag: 'STAR',
        description: 'Upcoming team with talented players',
        createdBy: createdUsers[2]._id,
        members: [
          { user: createdUsers[2]._id, role: 'Leader' }
        ],
        maxMembers: 4,
        stats: {
          tournamentsWon: 0,
          tournamentsPlayed: 2,
          totalWinnings: 500
        }
      }
    ];

    const createdTeams = await Team.insertMany(sampleTeams);
    console.log(`✅ Created ${createdTeams.length} sample teams`);

    // Create sample tournaments
    console.log('🎮 Creating sample tournaments...');
    const sampleTournaments = [
      {
        name: 'Apex Championship 2024',
        description: 'The biggest Apex Legends tournament of the year with massive prize pool',
        game: 'Apex Legends',
        format: 'Squad',
        maxTeams: 64,
        entryFee: 100,
        prizePool: 50000,
        currency: 'USD',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-17'),
        registrationStart: new Date(),
        registrationEnd: new Date('2024-03-10'),
        status: 'Registration',
        createdBy: createdUsers[0]._id,
        participants: [
          { team: createdTeams[0]._id, status: 'Registered' }
        ],
        prizeDistribution: [
          { position: '1st', prize: 25000 },
          { position: '2nd', prize: 15000 },
          { position: '3rd', prize: 7500 },
          { position: '4th', prize: 2500 }
        ],
        rules: [
          'Squad mode (4 players per team)',
          'No cheating or exploits allowed',
          'TPP (Third Person Perspective) only',
          'Points system: Placement + Eliminations',
          'Standard tournament rules apply'
        ]
      },
      {
        name: 'Weekend Warriors',
        description: 'Casual weekend tournament for all skill levels',
        game: 'BGMI',
        format: 'Squad',
        maxTeams: 32,
        entryFee: 0,
        prizePool: 1000,
        currency: 'INR',
        startDate: new Date('2024-02-24'),
        endDate: new Date('2024-02-25'),
        registrationStart: new Date(),
        registrationEnd: new Date('2024-02-23'),
        status: 'Upcoming',
        createdBy: createdUsers[1]._id,
        participants: [],
        prizeDistribution: [
          { position: '1st', prize: 500 },
          { position: '2nd', prize: 300 },
          { position: '3rd', prize: 200 }
        ],
        rules: [
          'Open for all skill levels',
          'Squad format (4 players)',
          'Classic match settings',
          'Fair play enforced'
        ]
      }
    ];

    const createdTournaments = await Tournament.insertMany(sampleTournaments);
    console.log(`✅ Created ${createdTournaments.length} sample tournaments`);

    // Display statistics
    console.log('\n📊 Database Initialization Complete!');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🏆 Teams: ${createdTeams.length}`);
    console.log(`🎮 Tournaments: ${createdTournaments.length}`);
    
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Email: legend@apexarena.com | Password: password123');
    console.log('Email: pro@apexarena.com | Password: password123');
    console.log('Email: newbie@apexarena.com | Password: password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

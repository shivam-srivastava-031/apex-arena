// Mock database - replace with actual database
const users = [
  {
    id: 1,
    email: 'player@apexarena.com',
    username: 'ElitePlayer',
    level: 25,
    rank: 'Diamond',
    wins: 150,
    losses: 50,
    createdAt: new Date()
  }
];

const userController = {
  // Get user profile
  getProfile: (req, res) => {
    try {
      const userId = req.user?.userId || 1;
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        level: user.level,
        rank: user.rank,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update user profile
  updateProfile: (req, res) => {
    try {
      const userId = req.user?.userId || 1;
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { username, level, rank } = req.body;
      users[userIndex] = { ...users[userIndex], username, level, rank };

      res.json({
        message: 'Profile updated successfully',
        user: users[userIndex]
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get user stats
  getUserStats: (req, res) => {
    try {
      const userId = req.user?.userId || 1;
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const winRate = user.wins / (user.wins + user.losses) * 100;

      res.json({
        wins: user.wins,
        losses: user.losses,
        winRate: Math.round(winRate * 100) / 100,
        level: user.level,
        rank: user.rank,
        totalGames: user.wins + user.losses
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get user teams
  getUserTeams: (req, res) => {
    try {
      const userId = req.user?.userId || 1;
      // Mock teams data
      const teams = [
        { id: 1, name: 'Elite Squad', role: 'Leader' },
        { id: 2, name: 'Phoenix Rising', role: 'Member' }
      ];

      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get user tournaments
  getUserTournaments: (req, res) => {
    try {
      const userId = req.user?.userId || 1;
      // Mock tournaments data
      const tournaments = [
        { id: 1, name: 'Apex Championship 2024', status: 'upcoming', role: 'Participant' },
        { id: 2, name: 'Summer Showdown', status: 'completed', position: 3 }
      ];

      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;

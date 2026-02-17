// Mock database - replace with actual database
const tournaments = [
  {
    id: 1,
    name: 'Apex Championship 2024',
    description: 'Annual gaming tournament',
    game: 'Apex Legends',
    maxTeams: 16,
    status: 'upcoming',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    prizePool: 50000,
    createdBy: 1,
    participants: [1, 2],
    createdAt: new Date()
  }
];

const tournamentController = {
  // Get all tournaments
  getAllTournaments: (req, res) => {
    try {
      const { status, game } = req.query;
      let filteredTournaments = tournaments;

      if (status) {
        filteredTournaments = filteredTournaments.filter(t => t.status === status);
      }

      if (game) {
        filteredTournaments = filteredTournaments.filter(t => t.game.toLowerCase() === game.toLowerCase());
      }

      res.json(filteredTournaments);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get tournament by ID
  getTournamentById: (req, res) => {
    try {
      const tournament = tournaments.find(t => t.id === parseInt(req.params.id));
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create new tournament
  createTournament: (req, res) => {
    try {
      const { name, description, game, maxTeams, startDate, endDate, prizePool } = req.body;
      const newTournament = {
        id: tournaments.length + 1,
        name,
        description,
        game,
        maxTeams,
        status: 'upcoming',
        startDate,
        endDate,
        prizePool,
        createdBy: req.user?.userId || 1,
        participants: [],
        createdAt: new Date()
      };

      tournaments.push(newTournament);
      res.status(201).json(newTournament);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update tournament
  updateTournament: (req, res) => {
    try {
      const tournamentIndex = tournaments.findIndex(t => t.id === parseInt(req.params.id));
      if (tournamentIndex === -1) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      const { name, description, status, startDate, endDate, prizePool } = req.body;
      tournaments[tournamentIndex] = { 
        ...tournaments[tournamentIndex], 
        name, 
        description, 
        status, 
        startDate, 
        endDate, 
        prizePool 
      };

      res.json(tournaments[tournamentIndex]);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete tournament
  deleteTournament: (req, res) => {
    try {
      const tournamentIndex = tournaments.findIndex(t => t.id === parseInt(req.params.id));
      if (tournamentIndex === -1) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      tournaments.splice(tournamentIndex, 1);
      res.json({ message: 'Tournament deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Join tournament
  joinTournament: (req, res) => {
    try {
      const tournament = tournaments.find(t => t.id === parseInt(req.params.id));
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      if (tournament.participants.length >= tournament.maxTeams) {
        return res.status(400).json({ error: 'Tournament is full' });
      }

      const userId = req.user?.userId || 1;
      if (!tournament.participants.includes(userId)) {
        tournament.participants.push(userId);
      }

      res.json({ message: 'Joined tournament successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = tournamentController;

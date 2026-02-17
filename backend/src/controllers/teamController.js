// Mock database - replace with actual database
const teams = [
  {
    id: 1,
    name: 'Elite Squad',
    description: 'Professional gaming team',
    createdBy: 1,
    members: [1, 2],
    createdAt: new Date()
  }
];

const teamController = {
  // Get all teams
  getAllTeams: (req, res) => {
    try {
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get team by ID
  getTeamById: (req, res) => {
    try {
      const team = teams.find(t => t.id === parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create new team
  createTeam: (req, res) => {
    try {
      const { name, description } = req.body;
      const newTeam = {
        id: teams.length + 1,
        name,
        description,
        createdBy: req.user?.userId || 1,
        members: [req.user?.userId || 1],
        createdAt: new Date()
      };

      teams.push(newTeam);
      res.status(201).json(newTeam);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update team
  updateTeam: (req, res) => {
    try {
      const teamIndex = teams.findIndex(t => t.id === parseInt(req.params.id));
      if (teamIndex === -1) {
        return res.status(404).json({ error: 'Team not found' });
      }

      const { name, description } = req.body;
      teams[teamIndex] = { ...teams[teamIndex], name, description };

      res.json(teams[teamIndex]);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete team
  deleteTeam: (req, res) => {
    try {
      const teamIndex = teams.findIndex(t => t.id === parseInt(req.params.id));
      if (teamIndex === -1) {
        return res.status(404).json({ error: 'Team not found' });
      }

      teams.splice(teamIndex, 1);
      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Join team
  joinTeam: (req, res) => {
    try {
      const team = teams.find(t => t.id === parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      const userId = req.user?.userId || 1;
      if (!team.members.includes(userId)) {
        team.members.push(userId);
      }

      res.json({ message: 'Joined team successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Leave team
  leaveTeam: (req, res) => {
    try {
      const team = teams.find(t => t.id === parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      const userId = req.user?.userId || 1;
      team.members = team.members.filter(memberId => memberId !== userId);

      res.json({ message: 'Left team successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = teamController;

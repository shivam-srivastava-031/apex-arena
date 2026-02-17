const Team = require('../models/Team');
const User = require('../models/User');

const teamController = {
  // Get all teams
  getAllTeams: async (req, res) => {
    try {
      const teams = await Team.find({ isActive: true })
        .populate('createdBy', 'username email avatar')
        .populate('members.user', 'username email avatar level rank')
        .sort({ createdAt: -1 });
      
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get team by ID
  getTeamById: async (req, res) => {
    try {
      const team = await Team.findById(req.params.id)
        .populate('createdBy', 'username email avatar')
        .populate('members.user', 'username email avatar level rank stats');
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create new team
  createTeam: async (req, res) => {
    try {
      const { name, tag, description, maxMembers } = req.body;
      
      // Check if team name or tag already exists
      const existingTeam = await Team.findOne({
        $or: [{ name }, { tag }],
        isActive: true
      });
      
      if (existingTeam) {
        return res.status(400).json({ 
          error: existingTeam.name === name ? 'Team name already taken' : 'Team tag already taken'
        });
      }

      // Create new team
      const newTeam = new Team({
        name,
        tag,
        description,
        maxMembers: maxMembers || 4,
        createdBy: req.user?.userId,
        members: [{
          user: req.user?.userId,
          role: 'Leader',
          joinedAt: new Date()
        }]
      });

      await newTeam.save();
      
      // Populate user data for response
      await newTeam.populate('createdBy', 'username email avatar');
      await newTeam.populate('members.user', 'username email avatar level rank');
      
      res.status(201).json(newTeam);
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update team
  updateTeam: async (req, res) => {
    try {
      const { name, description, maxMembers } = req.body;
      
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Check if user is team leader
      const userRole = team.getUserRole(req.user?.userId);
      if (userRole !== 'Leader') {
        return res.status(403).json({ error: 'Only team leaders can update team details' });
      }

      // Check if new name conflicts with existing teams
      if (name && name !== team.name) {
        const existingTeam = await Team.findOne({ name, isActive: true, _id: { $ne: team._id } });
        if (existingTeam) {
          return res.status(400).json({ error: 'Team name already taken' });
        }
      }

      // Update team
      team.name = name || team.name;
      team.description = description || team.description;
      team.maxMembers = maxMembers || team.maxMembers;

      await team.save();
      
      // Populate user data for response
      await team.populate('createdBy', 'username email avatar');
      await team.populate('members.user', 'username email avatar level rank');
      
      res.json(team);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete team
  deleteTeam: async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Check if user is team leader
      const userRole = team.getUserRole(req.user?.userId);
      if (userRole !== 'Leader') {
        return res.status(403).json({ error: 'Only team leaders can delete team' });
      }

      // Soft delete by setting isActive to false
      team.isActive = false;
      await team.save();
      
      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Join team
  joinTeam: async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Check if user is already a member
      if (team.isMember(req.user?.userId)) {
        return res.status(400).json({ error: 'Already a member of this team' });
      }

      // Check if team is full
      if (team.memberCount >= team.maxMembers) {
        return res.status(400).json({ error: 'Team is full' });
      }

      // Add user to team
      team.members.push({
        user: req.user?.userId,
        role: 'Member',
        joinedAt: new Date()
      });

      await team.save();
      
      // Populate user data for response
      await team.populate('members.user', 'username email avatar level rank');
      
      res.json({ message: 'Joined team successfully', team });
    } catch (error) {
      console.error('Error joining team:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Leave team
  leaveTeam: async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Check if user is a member
      if (!team.isMember(req.user?.userId)) {
        return res.status(400).json({ error: 'Not a member of this team' });
      }

      const userRole = team.getUserRole(req.user?.userId);
      
      // Leaders cannot leave, they must delete the team or transfer leadership
      if (userRole === 'Leader') {
        return res.status(400).json({ error: 'Team leaders cannot leave. Delete the team or transfer leadership first.' });
      }

      // Remove user from team
      team.members = team.members.filter(member => 
        member.user.toString() !== req.user?.userId.toString()
      );

      await team.save();
      
      res.json({ message: 'Left team successfully' });
    } catch (error) {
      console.error('Error leaving team:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = teamController;

const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Registration = require('../models/Registration');

const getDashboardStats = async () => {
    const [users, tournaments, teams] = await Promise.all([
        User.countDocuments(),
        Tournament.countDocuments(),
        Team.countDocuments()
    ]);

    const recentRegistrations = await Registration.find()
        .sort({ registeredAt: -1 })
        .limit(5)
        .populate('teamId', 'name')
        .populate('tournamentId', 'title');

    return {
        stats: {
            users,
            tournaments,
            teams
        },
        recentRegistrations
    };
};

module.exports = {
    getDashboardStats
};

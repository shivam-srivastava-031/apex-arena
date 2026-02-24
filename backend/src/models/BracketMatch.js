const mongoose = require('mongoose');

const bracketMatchSchema = new mongoose.Schema(
    {
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        },
        team1Name: { type: String, default: null },
        team2Name: { type: String, default: null },
        score1: { type: Number, default: null },
        score2: { type: Number, default: null },
        completed: { type: Boolean, default: false },
        winnerName: { type: String, default: null },
        roundName: { type: String, required: true },
        roundIndex: { type: Number, required: true },
        matchIndex: { type: Number, required: true }
    },
    { timestamps: true }
);

bracketMatchSchema.index({ tournamentId: 1, roundIndex: 1, matchIndex: 1 });

module.exports = mongoose.model('BracketMatch', bracketMatchSchema);

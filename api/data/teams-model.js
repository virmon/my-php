const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
    playerName: {
        type: String,
        required: true
    },
    joinedTeam: {
        type: Number,
        min: process.env.MIN_YEAR,
        max: process.env.MAX_YEAR
    },
    joinedNBA: {
        type: Number,
        min: process.env.MIN_YEAR,
        max: process.env.MAX_YEAR
    }
});

const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    established: {
        type: Number,
        min: process.env.MIN_YEAR,
        max: process.env.MAX_YEAR,
        required: true
    },
    championshipsWon: {
        type: Number,
        "default": process.env.DEFAULT_CHAMPIONSHIPS_WON
    },
    players: [playerSchema]
});

mongoose.model(process.env.TEAM_MODEL, teamSchema, process.env.TEAM_COLLECTION);
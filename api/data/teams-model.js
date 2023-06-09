const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
    playerName: {
        type: String,
        required: true
    },
    joinedTeam: {
        type: Number
    },
    joinedNBA: {
        type: Number
    }
});

const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    established: {
        type: Number,
        required: true
    },
    championshipsWon: {
        type: Number,
        "default": 0
    },
    players: [playerSchema]
});

mongoose.model("Team", teamSchema, "teams");
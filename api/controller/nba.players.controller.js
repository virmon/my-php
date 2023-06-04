const mongoose = require("mongoose");
const Team = mongoose.model(process.env.TEAM_MODEL);

const getAll = function(req, res) {
    let offset = parseFloat(process.env.DEFAULT_FIND_OFFSET, process.env.DEFAULT_BASE);
    let count = parseFloat(process.env.DEFAULT_FIND_COUNT, process.env.DEFAULT_BASE);

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (isNaN(offset) || isNaN(count)) {
        res.status(400).json({"message": "QueryString Offset and Count should be numbers"});
        return; 
    }

    const teamId = req.params.teamId;
    Team.findById(teamId).select("players").exec(function(err, team) {
        if (err) {
            console.log("Error in finding players");
            res.status(500).json(err);
        } else {
            console.log("Found players", team.players, "for Team", team);
            res.status(200).json(team.players);
        }
    });
}

const getOne = function(req, res) {
    const teamId = req.params.teamId;
    const playerId = req.params.playerId;

    Team.findById(teamId).exec(function(err, team) {
        if (err) {
            console.log("error finding the player", err);
            res.status(500).json(err);
        } else {
            const thePlayer = team.players.id(playerId);
            if (thePlayer) {
                console.log("Found player", thePlayer, "for Team", team.teamName);
                res.status(200).json(thePlayer);
            } else {
                console.log("Player not found", thePlayer);
                res.status(400).json({"message": "Player not found"});
            }
        }  
    });
}

const addOne = function(req, res) {
    const teamId = req.params.teamId;
    const newPlayer = {};
    newPlayer.playerName = req.body.playerName;
    newPlayer.joinedTeam = req.body.joinedTeam;
    newPlayer.joinedNBA = req.body.joinedNBA;

    Team.findById(teamId).select("players").exec(function(err, theTeam) {
        if(err) {
            console.log("Error saving new player", err);
            res.status(500).json(err.message);
        } else {
            theTeam.players.push(newPlayer);
            theTeam.save();
            console.log("Saved new player successfully", newPlayer);
            res.status(200).json(newPlayer);
        }
    });
}

const updateOne = function(req, res) {
    const teamId = req.params.teamId;
    const playerId = req.params.playerId;

    if (isNaN(req.body.joinedTeam) && isNaN(req.body.joinedNBA)) {
        console.log("Invalid request body");
        res.status(400).json({"message": "Invalid request body"});
        return;
    }

    Team.findById(teamId).select("players").exec(function (err, theTeam) {
        if (err) {
            console.log("Error on updating player", err);
            res.status(500).json(err.message);
        } else {
            const thePlayer = theTeam.players.id(playerId);
            thePlayer.playerName = req.body.playerName;
            thePlayer.joinedTeam = req.body.joinedTeam;
            thePlayer.joinedNBA = req.body.joinedNBA;
    
            theTeam.save();
            console.log("Updated the player successfully", thePlayer);
            res.status(200).json(thePlayer);
        }
    });
}

const deleteOne = function(req, res) {
    const teamId = req.params.teamId;
    const playerId = req.params.playerId;

    Team.findById(teamId).select("players").exec(function(err, theTeam) {
        if (err) {
            console.log("Error deleting player", err);
            res.status(500).json(err.message);
        } else {
            const thePlayer = theTeam.players.id(playerId);
            thePlayer.remove();
            theTeam.save();
            console.log("Deleted the player successfully", thePlayer);
            res.status(200).json(thePlayer);
        }
    });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne
}
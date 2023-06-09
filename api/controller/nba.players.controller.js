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
        } else if (!team) {
            console.log("Team not found");
            res.status(404).json({"message" : "Team not found"});
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
    
    Team.findById(teamId).select("players").exec(function(err, theTeam) {
        const response = { status: 201, message: theTeam };
        if(err) {
            console.log("Error saving new player", err);
            response.status = 500;
            response.message = err;
        } else if (!theTeam) {
            response.status = 404;
            response.message = {"message": "TeamId not Found"};    
        }
        if (theTeam) {
            _addPlayer(req, res, theTeam);
        } else {
            res.status(response.status).json(response.message);
        }
    });
}

const _addPlayer = function(req, res, team) {
    const newPlayer = {};
    newPlayer.playerName = req.body.playerName;
    newPlayer.joinedTeam = req.body.joinedTeam;
    newPlayer.joinedNBA = req.body.joinedNBA;
    
    team.players.push(newPlayer);
    team.save(function(err, updatedTeam){ 
        const response = { status: 201, message: updatedTeam };
        if (err) {
            response.status = 500;
            response.message = err;
        }
        console.log("Saved new player successfully");
        res.status(response.status).json(response.message);
    });
}

const _updateOne = function(req, res, playerUpdateCallback) {
    const teamId = req.params.teamId;

    Team.findById(teamId).select("players").exec(function (err, team) {
        const response = { status: 204, message: team };
        if (err) {
            response.status = 500;
            response.status = err;
        } else if (!team) {
            response.status = 404;
            response.message = {"message": "Team Id not found"};
        } 
        if (response.status !== 204) {
            res.status(response.status).json(response.message);
        }
        playerUpdateCallback(req, res, team);
    });
}

const _fullPlayerUpdate = function (req, res, team) {
    const playerId = req.params.playerId;
    const thePlayer = team.players.id(playerId);

    thePlayer.playerName = req.body.playerName;
    thePlayer.joinedTeam = req.body.joinedTeam;
    thePlayer.joinedNBA = req.body.joinedNBA;
    
    team.save(function(err, updatedTeam) {
        const response = { status: 204, message: updatedTeam };
        if (err) {
            response.status = 500;
            response.message = err;
        }
        console.log("_fullPlayerUpdate success", updatedTeam.players);
        res.status(response.status).json(response.message);
    });
}

const _partialPlayerUpdate = function (req, res, team) {
    const playerId = req.params.playerId;
    const thePlayer = team.players.id(playerId);

    if (req.body.playerName) {
        thePlayer.playerName = req.body.playerName;
    }
    if (req.body.joinedTeam) {
        thePlayer.joinedTeam = req.body.joinedTeam;
    }
    if (req.body.joinedNBA) {
        thePlayer.joinedNBA = req.body.joinedNBA;
    }
    team.save(function(err, updatedTeam) {
        const response = { status: 204, message: updatedTeam };
        if (err) {
            response.status = 500;
            response.message = err;
        }
        console.log("_partialPlayerUpdate success", updatedTeam.players);
        res.status(response.status).json(response.message);
    });
}

const fullUpdateOne = function (req, res) {
    console.log("Full update player", req.body);
    _updateOne(req, res, _fullPlayerUpdate);
}

const partialUpdateOne = function (req, res) {
    console.log("Partial update player", req.body);
    _updateOne(req, res, _partialPlayerUpdate);
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
    getAll: getAll,
    getOne: getOne,
    addOne: addOne,
    fullUpdateOne: fullUpdateOne,
    partialUpdateOne: partialUpdateOne,
    deleteOne: deleteOne
}
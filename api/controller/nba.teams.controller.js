require("../data/teams-model");

const mongoose = require("mongoose");
const Team = mongoose.model("Team");

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

    Team.find().skip(offset).limit(count).exec(function(err, teams) {
        if (err) {
            console.log("Error finding teams", err);
            res.status(500).json(err.message);
        } else {
            console.log("No. of teams found", teams.length);
            res.status(200).json(teams);
        }
    });
}

const getOne = function(req, res) {
    const teamId = req.params.teamId;
    Team.findById(teamId).exec(function(err, theTeam) {
        if (err) {
            console.log("Error finding the team", err);
            res.status(500).json(err.message);
        } else {
            if (theTeam) {
                console.log("Found team", theTeam);
                res.status(200).json(theTeam);
            } else {
                console.log("Team not found", theTeam);
                res.status(400).json({"message": "Team not found"});
            }
        }
    });
}

const addOne = function(req, res) {
    if (Array.isArray(req.body)) {
        addMany(req, res);
    } else {
        const newTeam = {};
        newTeam.teamName = req.body.teamName;
        newTeam.established = req.body.established;

        Team.create(newTeam, function(err, team) {
            const response = { status: 201, message: team };
            if (err) {
                console.log("Error adding the team", err);
                response.status = 500;
                response.message = err;
            }
            res.status(response.status).json(response.message);
        });
    }
}

const addMany = function(req, res) {
    if (Array.isArray(req.body)) {
        Team.insertMany(req.body, function(err, theTeams) {
            if (err) {
                res.status(500).json(err.message);
            } else {
                console.log("Inserted new teams", theTeams);
                res.status(200).json(theTeams);
            }
        });
    } else {
        res.status(400).json({"message": "Expects to receive array from request body"});
    }
}

const _updateOne = function(req, res, updateTeamCallback) {
    const teamId = req.params.teamId;
    
    Team.findById(teamId).exec(function(err, team) {
        const response = { status: 204, message: team };

        if (err) {
            console.log("Error on update", err);
            response.status = 500;
            response.message = err;
        } else if (!team) {
            response.status = 404;
            response.message = {"message": "Team not found"};
        } 
        if (response.status !== 204) {
            res.status(response.status).json(response.message);
        } else {
            updateTeamCallback(req, res, team, response);
        }
    });
}

const fullUpdateOne = function(req, res) {
    const teamUpdate = function (req, res, team, response) {
        team.teamName = req.body.teamName;
        team.established = req.body.established;
        team.championshipsWon = req.body.championshipsWon;
        team.players = [];
        team.save(function(err, updatedTeam) {
            if (err) {
                response.status = 500;
                response.message = err;
            }
            res.status(response.status).json(response.message);
        });
    }
    _updateOne(req, res, teamUpdate);
}

const partialUpdateOne = function(req, res) {
    const teamUpdate = function (req, res, team, response) {
        if (req.body.teamName) {
            team.teamName = req.body.teamName;
        }
        if (req.body.established) {
            team.established = req.body.established;
        }
        if (req.body.championshipsWon) {
            team.championshipsWon = req.body.championshipsWon;
        }
        if (req.body.players) {
            team.players = [];
        }
        team.save(function(err, updatedTeam) {
            if (err) {
                response.status = 500;
                response.message = err;
            }
            res.status(response.status).json(response.message);
        });
    }
    _updateOne(req, res, teamUpdate);
}

const deleteOne = function(req, res) {
    const teamId = req.params.teamId;
    Team.findByIdAndDelete(teamId, function(err, deletedTeam) {
        if (err) {
            console.log("Error on deleting", err);
            res.status(500).json(err.message);
        } else {
            console.log("Successfully deleted", deletedTeam);
            res.status(200).json(deletedTeam);
        }
        
    });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdateOne: fullUpdateOne,
    partialUpdateOne: partialUpdateOne,
    deleteOne
}
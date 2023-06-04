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
        
        const newTeamInstance = new Team(newTeam);
        newTeamInstance.save(function(err, team) {
            if (err) {
                console.log("Error adding the team", err);
                res.status(500).json(err.message);
            } else {
                console.log("Added new team", team.teamName);
                res.status(200).json(team);
            }
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

const updateOne = function(req, res) {
    const teamId = req.params.teamId;
    const updatedTeam = {};
    updatedTeam.teamName = req.body.teamName;
    updatedTeam.established = req.body.established;

    Team.findById(teamId)
        .updateOne({$set: updatedTeam}, function(err, updatedStatus) {
            if (err) {
                console.log("Error on update", err);
                res.status(500).json(err.message);
            } else {
                console.log("Successfully updated", updatedStatus);
                res.status(200).json(updatedStatus);
            }
        });
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
    updateOne,
    deleteOne
}
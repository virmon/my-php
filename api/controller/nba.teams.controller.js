const mongoose = require("mongoose");
const Team = mongoose.model(process.env.TEAM_MODEL);

const response = { status: process.env.NOT_FOUND_STATUS_CODE, message: ""};

const _setResponse = function (status, message) {
    response.status = status;
    response.message = message;
}

const _sendResponse = function(res, response) {
    res.status(parseInt(response.status)).json(response.message);
}

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
        _setResponse(process.env.BAD_REQUEST_STATUS_CODE, process.env.LIMITER_ERROR_MESSAGE);
        _sendResponse(res, response);
        return;
    }

    const mostChampionshipsWon = {"championshipsWon": -1};
    
    Team.find().skip(offset).limit(count).sort(mostChampionshipsWon).exec()
        .then((foundTeams) => _setResponse(process.env.SUCCESS_STATUS_CODE, foundTeams))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const getOne = function(req, res) {
    const teamId = req.params.teamId;

    let offset = parseFloat(process.env.DEFAULT_FIND_OFFSET, process.env.DEFAULT_BASE);
    let count = parseFloat(process.env.DEFAULT_FIND_COUNT, process.env.DEFAULT_BASE);

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (isNaN(offset) || isNaN(count)) {
        _setResponse(process.env.BAD_REQUEST_STATUS_CODE, { "message": process.env.LIMITER_ERROR_MESSAGE });
        return;
    }

    const query = {
        "players": {
            $slice: [offset, count]
        }
    };

    Team.findById(teamId).select(query).exec()
        .then((foundTeam) => _setResponse(process.env.SUCCESS_STATUS_CODE, foundTeam))
            .catch(() => _setResponse(process.env.NOT_FOUND_STATUS_CODE, process.env.TEAM_NOT_FOUND))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const _fillTeamData = function (req) {
    const newTeam = {};
    newTeam.teamName = req.body.teamName;
    newTeam.established = req.body.established;
    newTeam.championshipsWon = req.body.championshipsWon;
    return new Promise((resolve, reject) => {
        resolve(newTeam);
    });
}

const _validateTeamName = function (filledNewTeam) {
    return new Promise((resolve, reject) => {
        Team.findOne({"teamName": filledNewTeam.teamName})
            .then((foundTeam) => {
                if (!foundTeam) {
                    resolve(filledNewTeam);
                } else {
                    reject({"message": process.env.TEAM_NAME_UNAVAILABLE_MESSAGE});
                }
            });
    });
}

const _createNewTeam = function (newTeam) {
    return Team.create(newTeam);
}

const addOne = function(req, res) {
    _fillTeamData(req)
        .then((filledNewTeam) => _validateTeamName(filledNewTeam))
        .then((newTeam) => _createNewTeam(newTeam))
        .then((createdTeam) => _setResponse(process.env.CREATE_SUCCESS_STATUS_CODE, createdTeam))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const _updateOne = function(req, res, updateTeamCallback) {
    const teamId = req.params.teamId;
    Team.findById(teamId).exec()
        .then((team) => updateTeamCallback(req, team))
            .catch(() => _setResponse(process.env.NOT_FOUND_STATUS_CODE, process.env.TEAM_NOT_FOUND))
        .then((updatedTeam) => _setResponse(process.env.SUCCESS_STATUS_CODE, updatedTeam))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const fullUpdateOne = function(req, res) {
    const teamUpdate = function (req, team) {
        team.teamName = req.body.teamName;
        team.established = req.body.established;
        team.championshipsWon = req.body.championshipsWon;
        team.players = [];
        team.save();

        return new Promise((resolve, reject) => {
            if (team) {
                resolve(team);
            } else {
                reject();
            }
        });
    }
    _updateOne(req, res, teamUpdate);
}

const partialUpdateOne = function(req, res) {
    const teamUpdate = function (req, team) {
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
        team.save();

        return new Promise((resolve, reject) => {
            if (team) {
                resolve(team);
            } else {
                reject();
            }
        });
    }
    _updateOne(req, res, teamUpdate);
}

const deleteOne = function(req, res) {
    const teamId = req.params.teamId;
    Team.findById(teamId).deleteOne()
        .then((deletedTeam) =>  _setResponse(process.env.SUCCESS_STATUS_CODE, deletedTeam))
            .catch(() => _setResponse(process.env.NOT_FOUND_STATUS_CODE, process.env.TEAM_NOT_FOUND))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    getAll: getAll,
    getOne: getOne,
    addOne: addOne,
    fullUpdateOne: fullUpdateOne,
    partialUpdateOne: partialUpdateOne,
    deleteOne: deleteOne
}
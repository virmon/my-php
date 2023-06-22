const mongoose = require("mongoose");
const Team = mongoose.model(process.env.TEAM_MODEL);

const response = { status: process.env.NOT_FOUND_STATUS_CODE, message: "" };

const _setResponse = function (status, message) {
    response.status = status;
    response.message = message;
}

const _sendResponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.message);
}

const _checkTeamExists = function (team) {
    return new Promise((resolve, reject) => {
        if (!team) {
            _setResponse(process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.TEAM_NOT_FOUND });
            reject();
        } else {
            _setResponse(process.env.SUCCESS_STATUS_CODE, team.players);
            resolve(team);
        }
    });
}

const _findTeam = function (req) {
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

    return Team.findById(teamId).select(query).exec();
}

const _findPlayer = function (team, playerId) {
    const thePlayer = team.players.id(playerId);

    return new Promise((resolve, reject) => {
        if (thePlayer) {
            _setResponse(process.env.SUCCESS_STATUS_CODE, thePlayer);
        } else {
            _setResponse(process.env.BAD_REQUEST_STATUS_CODE, { "message": process.env.PLAYER_NOT_FOUND });
        }
        resolve();
    })
}

const _fillPlayerData = function (req) {
    return new Promise((resolve, reject) => {
        const newPlayer = {};
        newPlayer.playerName = req.body.playerName;
        newPlayer.joinedTeam = req.body.joinedTeam;
        newPlayer.joinedNBA = req.body.joinedNBA;
        resolve(newPlayer);
    });
}

const _saveNewPlayer = function (team, newPlayer) {
    team.players.push(newPlayer);
    return team.save();
}

const _addPlayer = function (req, res, team) {
    return new Promise((resolve, reject) => {
        _fillPlayerData(req)
            .then((filledNewPlayer) => _saveNewPlayer(team, filledNewPlayer))
            .then((updatedTeam) => _setResponse(201, updatedTeam))
            .then(() => resolve())
            .catch((err) => reject(err));
    })
}

const _updateOne = function (req, res, playerUpdateCallback) {
    _findTeam(req)
        .then((team) => _checkTeamExists(team))
        .then((team) => playerUpdateCallback(req, res, team))
        .then((team) => _setResponse(process.env.SUCCESS_STATUS_CODE, team))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const _fullPlayerUpdate = function (req, res, team) {
    const playerId = req.params.playerId;
    const thePlayer = team.players.id(playerId);

    thePlayer.playerName = req.body.playerName;
    thePlayer.joinedTeam = req.body.joinedTeam;
    thePlayer.joinedNBA = req.body.joinedNBA;

    return team.save();
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
    return team.save();
}

const _deletePlayer = function (theTeam, playerId) {
    const thePlayer = theTeam.players.id(playerId);
    thePlayer.remove();
    return theTeam.save();
}

const getAll = function (req, res) {
    _findTeam(req)
        .then((team) => _checkTeamExists(team))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const getOne = function (req, res) {
    const playerId = req.params.playerId;

    _findTeam(req)
        .then((team) => _checkTeamExists(team))
        .then((team) => _findPlayer(team, playerId))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const addOne = function (req, res) {
    _findTeam(req)
        .then((theTeam) => _checkTeamExists(theTeam))
        .then((theTeam) => _addPlayer(req, res, theTeam))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const fullUpdateOne = function (req, res) {
    _updateOne(req, res, _fullPlayerUpdate);
}

const partialUpdateOne = function (req, res) {
    _updateOne(req, res, _partialPlayerUpdate);
}

const deleteOne = function (req, res) {
    const playerId = req.params.playerId;

    _findTeam(req)
        .then((team) => _deletePlayer(team, playerId))
        .then((deletedPlayer) => _setResponse(process.env.SUCCESS_STATUS_CODE, deletedPlayer))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    getAll: getAll,
    getOne: getOne,
    addOne: addOne,
    fullUpdateOne: fullUpdateOne,
    partialUpdateOne: partialUpdateOne,
    deleteOne: deleteOne,
}
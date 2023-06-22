const express = require("express");

const teamsController = require("../controller/nba.teams.controller");
const playersController = require("../controller/nba.players.controller");
const authenticationController = require("../controller/authentication.controller");

const router = express.Router();

router.route("/")
    .get(teamsController.getAll)
    .post(authenticationController.authenticate, teamsController.addOne);

router.route("/:teamId")
    .get(teamsController.getOne)
    .put(authenticationController.authenticate, teamsController.fullUpdateOne)
    .patch(authenticationController.authenticate, teamsController.partialUpdateOne)
    .delete(authenticationController.authenticate, teamsController.deleteOne);

router.route("/:teamId/players")
    .get(playersController.getAll)
    .post(authenticationController.authenticate, playersController.addOne);

router.route("/:teamId/players/:playerId")
    .get(playersController.getOne)
    .put(authenticationController.authenticate, playersController.fullUpdateOne)
    .patch(authenticationController.authenticate, playersController.partialUpdateOne)
    .delete(authenticationController.authenticate, playersController.deleteOne);

module.exports = router;
const express = require("express");

const teamsController = require("../controller/nba.teams.controller");
const playersController = require("../controller/nba.players.controller");
const authenticationController = require("../controller/authentication.controller");

const router = express.Router();

router.route("/")
    .get(teamsController.getAll)
    .post(teamsController.addOne);

router.route("/:teamId")
    .get(teamsController.getOne)
    .put(teamsController.fullUpdateOne)
    .patch(teamsController.partialUpdateOne)
    .delete(teamsController.deleteOne);

router.route("/:teamId/players")
    .get(playersController.getAll)
    .post(playersController.addOne);

router.route("/:playerId")
    .get(playersController.getOne)
    .put(playersController.fullUpdateOne)
    .patch(playersController.partialUpdateOne)
    .delete(playersController.deleteOne);

module.exports = router;
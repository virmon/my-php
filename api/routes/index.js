const express = require("express");

const teamsController = require("../controller/nba.teams.controller");
const playersController = require("../controller/nba.players.controller");

const router = express.Router();

router.route("/teams")
    .get(teamsController.getAll)
    .post(teamsController.addOne);

router.route("/teams/:teamId")
    .get(teamsController.getOne)
    .put(teamsController.fullUpdateOne)
    .patch(teamsController.partialUpdateOne)
    .delete(teamsController.deleteOne);

router.route("/teams/:teamId/players")
    .get(playersController.getAll)
    .post(playersController.addOne);

router.route("/teams/:teamId/players/:playerId")
    .get(playersController.getOne)
    .put(playersController.fullUpdateOne)
    .patch(playersController.partialUpdateOne)
    .delete(playersController.deleteOne);

module.exports = router;
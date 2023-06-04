const express = require("express");

const teamsController = require("../controller/nba.teams.controller");
const playersController = require("../controller/nba.players.controller");

const router = express.Router();

router.route("/teams").get(teamsController.getAll);
router.route("/teams/:teamId").get(teamsController.getOne);
router.route("/teams").post(teamsController.addOne);
router.route("/teams/:teamId").put(teamsController.updateOne);
router.route("/teams/:teamId").delete(teamsController.deleteOne);

router.route("/teams/:teamId/players").get(playersController.getAll);
router.route("/teams/:teamId/players/:playerId").get(playersController.getOne);
router.route("/teams/:teamId/players").post(playersController.addOne);
router.route("/teams/:teamId/players/:playerId").put(playersController.updateOne);
router.route("/teams/:teamId/players/:playerId").delete(playersController.deleteOne);

module.exports = router;
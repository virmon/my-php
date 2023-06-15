const express = require("express");
const teamsController = require("../controller/nba.teams.controller");

const router = express.Router();

router.route("/")
    .get(teamsController.getAll)
    .post(teamsController.addOne);

router.route("/:teamId")
    .get(teamsController.getOne)
    .put(teamsController.fullUpdateOne)
    .patch(teamsController.partialUpdateOne)
    .delete(teamsController.deleteOne);

module.exports = router;
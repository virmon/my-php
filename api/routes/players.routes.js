const express = require("express");
const playersController = require("../controller/nba.players.controller");

const router = express.Router();

router.route("/")
    .get(playersController.getAll)
    .post(playersController.addOne);

router.route("/:playerId")
    .get(playersController.getOne)
    .put(playersController.fullUpdateOne)
    .patch(playersController.partialUpdateOne)
    .delete(playersController.deleteOne);

module.exports = router;
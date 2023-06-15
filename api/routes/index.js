const express = require("express");

const teamsRoutes = require("../routes/teams.routes");
const playersRoutes = require("../routes/players.routes");
const usersRoutes = require("../routes/users.routes");

const router = express.Router();

router.use("/teams", teamsRoutes);
router.use("/teams/:teamId/players", playersRoutes);
router.use("/users", usersRoutes);

module.exports = router;
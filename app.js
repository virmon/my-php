const express = require("express");
require("dotenv").config();
const routes = require("./api/routes");
require("./api/data/db.js");

const bodyParser = require("body-parser");

const app = express();

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(bodyParser.json({ extended: false }));

app.use("/api", routes);

const server = app.listen(process.env.PORT, function() {
    console.log("Listening to http://localhost:" + server.address().port);
});
const express = require("express");
require("dotenv").config();
require("./api/data/db.js");
const routes = require("./api/routes");

const bodyParser = require("body-parser");

const app = express();

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(bodyParser.json({ extended: false }));

app.use("/api", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT, PATCH");
    next();
})

app.use("/api", routes);

const server = app.listen(process.env.PORT, function() {
    console.log("Listening to http://localhost:" + server.address().port);
});
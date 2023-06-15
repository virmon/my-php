const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const _logMongooseConnected = function () { console.log(process.env.MONGOOSE_CONNECTED + process.env.DB_NAME); }
const _logMongooseDisconnected = function () { console.log(process.env.MONGOOSE_DISCONNECTED); }
const _logMongooseError = function (err) { console.log(process.env.MONGOOSE_ERROR + err); }

mongoose.connection.on("connected", _logMongooseConnected);
mongoose.connection.on("disconnected", _logMongooseDisconnected);
mongoose.connection.on("error", _logMongooseError);

process.on("SIGINT", function () {
    mongoose.connection.close(function () {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});
process.on("SIGTERM", function () {
    mongoose.connection.close(function () {
        console.log(process.env.SIGTERM_MESSAGE);
        process.exit(0);
    });
});
process.on("SIGTERM", function () {
    mongoose.connection.close(function () {
        console.log(process.env.SIGUSR2_MESSAGE);
        process.exit(0);
    });
});
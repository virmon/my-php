const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("User");

const response = { status: 404, message: "Not found"};

const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}

const _setResponse = function (status, message) {
    response.status = status;
    response.message = message;
}

const _hashPassword = function (plainTextPassword, salt) {
    console.log("Hash password called");

    return bcrypt.hash(plainTextPassword, salt);
}

const _generateSalt = function () {
    console.log("generate salt called");
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    return bcrypt.genSalt(saltRounds);
}

const _fillUserData = function (req, hashedPassword) {
    console.log("Fill User data called");

    const newUser = {};
    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.password = hashedPassword;
    return new Promise((resolve, reject) => {
        resolve(newUser);
    });
}

const _validateUsername = function (filledUser) {
    console.log("Validation called");
    return new Promise((resolve, reject) => {
        User.findOne({"username": filledUser.username})
            .then((foundUser) => {
                if (!foundUser) {
                    resolve(filledUser);
                } else {
                    reject({"message": "Username not available"});
                }
            });
    });
}

const _createNewUser = function (validatedUser) {
    console.log("create user called");
    User.create(validatedUser);
}

const register = function (req, res) {
    console.log("Register called");
    
    _generateSalt()
        .then((salt) => _hashPassword(req.body.password, salt))
        .then((hashedPassword) => _fillUserData(req, hashedPassword))
        .then((filledUser) => _validateUsername(filledUser))
        .then((validatedUser) => _createNewUser(validatedUser))
        .then(() => _setResponse(201, {"message": "Register success"}))
        .catch((err) => _setResponse(500, err))
        .finally(() => _sendResponse(res, response));
}

const _checkPassword = function (requestedPassword, savedPassword) {
    console.log("Check password called");
    return bcrypt.compare(requestedPassword, savedPassword);
}

const _checkUserVerified = function (isUserVerified) {
    console.log("isUserVerified", isUserVerified);
    return new Promise((resolve, reject) => {
        if (isUserVerified) {
            resolve();
        } else {
            reject();
        }
    });
}

const login = function (req, res) {
    console.log("Login called");
    User.findOne({"username": req.body.username})
        .then((foundUser) => _checkPassword(req.body.password, foundUser.password))
        .then((isUserVerified) => _checkUserVerified(isUserVerified))
        .then(() => _setResponse(200, {"message": "Login success"}))
        .catch(() => _setResponse(500, {"message": "Login failed"}))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    register: register,
    login: login
}
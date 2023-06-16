const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

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
    return User.create(validatedUser);
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

const _checkPassword = function (databasePassword, user) {
    console.log("Check password called");
    return new Promise((resolve, reject) => {
        bcrypt.compare(databasePassword, user.password)
            .then((isUserAuthenticated) => {
                if (isUserAuthenticated) {
                    resolve(user);
                } else {
                    reject();
                }
            });
    });
}

const _checkExists = function (foundUser) {
    console.log("checkExists called", foundUser);
    return new Promise((resolve, reject) => {
        if (!foundUser) {
            reject();
        } else {
            resolve(foundUser);
        }
    });
}

const _generateToken = function (name) {
    const sign = util.promisify(jwt.sign);
    return sign({"name": name}, "secretKey", {expiresIn: 3600});
}

const login = function (req, res) {
    console.log("Login called");

    User.findOne({"username": req.body.username})
        .then((foundUser) => _checkExists(foundUser))
        .then((user) => _checkPassword(req.body.password, user))
        .then((user) => _generateToken(user.name))
        .then((token) => _setResponse(200, {token}))
        .catch(() => _setResponse(500, {"message": process.env.LOGIN_FAILED}))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    register: register,
    login: login
}
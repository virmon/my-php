const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const User = mongoose.model(process.env.USER_MODEL);

const response = { status: process.env.NOT_FOUND_STATUS_CODE, message: ""};

const _sendResponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.message);
}

const _setResponse = function (status, message) {
    response.status = status;
    response.message = message;
}

const _hashPassword = function (plainTextPassword, salt) {
    return bcrypt.hash(plainTextPassword, salt);
}

const _generateSalt = function () {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    return bcrypt.genSalt(saltRounds);
}

const _fillUserData = function (req, hashedPassword) {
    const newUser = {};
    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.password = hashedPassword;
    return new Promise((resolve, reject) => {
        resolve(newUser);
    });
}

const _validateUsername = function (filledUser) {
    return new Promise((resolve, reject) => {
        User.findOne({"username": filledUser.username})
            .then((foundUser) => {
                if (!foundUser) {
                    resolve(filledUser);
                } else {
                    reject({"message": process.env.USERNAME_UNAVAILABLE_MESSAGE});
                }
            });
    });
}

const _createNewUser = function (validatedUser) {
    return User.create(validatedUser);
}

const register = function (req, res) {
    _generateSalt()
        .then((salt) => _hashPassword(req.body.password, salt))
        .then((hashedPassword) => _fillUserData(req, hashedPassword))
        .then((filledUser) => _validateUsername(filledUser))
        .then((validatedUser) => _createNewUser(validatedUser))
        .then(() => _setResponse(process.env.CREATE_SUCCESS_STATUS_CODE, {"message": process.env.REGISTER_SUCCESS_MESSAGE}))
        .catch((err) => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, err))
        .finally(() => _sendResponse(res, response));
}

const _checkPassword = function (databasePassword, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(databasePassword, user.password)
            .then((isUserAuthenticated) => {
                if (isUserAuthenticated) {
                    resolve(user);
                } else {
                    reject({"message": process.env.ERROR_LOGIN_MESSAGE});
                }
            });
    });
}

const _checkExists = function (foundUser) {
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
    return sign({"name": name}, process.env.JWT_SECRET_KEY, {expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRATION)});
}

const login = function (req, res) {
    User.findOne({"username": req.body.username})
        .then((foundUser) => _checkExists(foundUser))
        .then((user) => _checkPassword(req.body.password, user))
        .then((user) => _generateToken(user.name))
        .then((token) => _setResponse(process.env.SUCCESS_STATUS_CODE, {token}))
        .catch(() => _setResponse(process.env.SYSTEM_ERROR_STATUS_CODE, {"message": process.env.ERROR_LOGIN_MESSAGE}))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    register: register,
    login: login
}
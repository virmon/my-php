const jwt = require("jsonwebtoken");

const response = { status: process.env.FORBIDDEN_STATUS_CODE, message: process.env.NO_TOKEN_MESSAGE};

const _sendResponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.message);
}

const _checkHeader = function (authorizationHeader) {
    return new Promise((resolve, reject) => {
        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            resolve(token);
        } else {
            reject({"message": NO_AUTHORIZATION_HEADER_MESSAGE});
        }
    })
}

const _verifyToken = function (token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            console.log(token);
            reject({"message": process.env.NO_TOKEN_MESSAGE});
        } else {
            const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            resolve(isTokenVerified);
        }
    });
}

const authenticate = function (req, res, next) {
    _checkHeader(req.headers.authorization)
        .then((token) => _verifyToken(token))
        .then(() => next())
        .catch(() => _sendResponse(res, response));
}

module.exports = {
    authenticate
}
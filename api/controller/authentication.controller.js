const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}

const authenticate = function (req, res, next) {
    console.log("authenticate called");
    const response = { status: 403, message: "No token provided"};
    const headerExists = req.headers.authorization;

    if (headerExists) {
        const token = req.headers.authorization.split(" ")[1];
        if (jwt.verify(token, "secretKey")) {
            next();
        } else {
            _sendResponse(res, response);
        }
    } else {
        _sendResponse(res, response);
    }
}

module.exports = {
    authenticate
}
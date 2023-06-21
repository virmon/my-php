const _sendResponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.message);
}

const authenticate = function (req, res, next) {
    const headerExists = req.headers.authorization;

    if (headerExists) {
        const token = req.headers.authorization.split(" ")[1];
        const response = { status: process.env.FORBIDDEN_STATUS_CODE, message: process.env.NO_TOKEN_MESSAGE};
        
        if (jwt.verify(token, proess.env.JWT_SECRET_KEY)) {
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
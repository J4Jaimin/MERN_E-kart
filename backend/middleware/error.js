const errorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {

    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong Mongodb Id error

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new errorHandler(message, 400);
    }

    // mongoose duplicate key error.
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new errorHandler(message, 400);
    }

    // Wrong JWT Error.
    if (err.name === "JsonWebTokenError") {
        const message = "Json web token is invalid, please try again.";
        err = new errorHandler(message, 400);
    }

    // Wrong JWT Expire error.
    if (err.name === "TokenExpiredError") {
        const message = "Json web token is Expired, please try again.";
        err = new errorHandler(message, 400);
    }

    res.status(err.statuscode).json({
        success: false,
        message: err.message
    });
}; 
const errorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {

    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong Mongodb Id error

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new errorHandler(message, 400);
    }

    res.status(err.statuscode).json({
        success: false,
        message: err.message
    });
};
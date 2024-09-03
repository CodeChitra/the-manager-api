"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err.message); // Log the error details to the console
    res.status(500).json({ msg: err.message });
};
exports.default = errorHandlerMiddleware;

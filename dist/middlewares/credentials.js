"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (config_1.allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};
exports.default = credentials;

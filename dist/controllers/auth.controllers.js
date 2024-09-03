"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const user_schema_1 = require("../schema/user.schema");
const user_models_1 = __importDefault(require("../models/user.models"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = user_schema_1.registerUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const duplicate = yield user_models_1.default.findOne({ email });
    if (duplicate) {
        res.sendStatus(http_status_codes_1.StatusCodes.CONFLICT); //conflict
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = { name, password: hashedPassword, email };
    yield user_models_1.default.create(newUser);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: `New user is created.` });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = user_schema_1.loginUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const { email, password: pwd } = req.body;
    const foundUser = yield user_models_1.default.findOne({ email });
    // check if user exists
    if (!foundUser) {
        return res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    // match password
    const match = yield bcrypt_1.default.compare(pwd, foundUser.password);
    if (!match) {
        res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: "password does not match!" });
    }
    // create access & refresh tokens
    const accessToken = jsonwebtoken_1.default.sign({ userId: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" } // 15 minutes
    );
    const refreshToken = jsonwebtoken_1.default.sign({ userId: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
    yield user_models_1.default.findByIdAndUpdate(foundUser._id, { refreshToken }, { new: true });
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
});
exports.login = login;
//! REFRESH
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log("Cookies: ", cookies);
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const refreshToken = cookies.jwt;
    const foundUser = yield user_models_1.default.findOne({ refreshToken });
    if (!foundUser)
        return res.sendStatus(http_status_codes_1.StatusCodes.FORBIDDEN);
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
        if (err) {
            return res.sendStatus(http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "900s" });
        res.json({ accessToken });
    });
});
exports.refresh = refresh;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!cookies.jwt)
        return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    const refreshToken = cookies.jwt;
    const foundUser = yield user_models_1.default.findOne({ refreshToken });
    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    yield user_models_1.default.findByIdAndUpdate(foundUser._id, { refreshToken: "" }, { new: true });
    res.clearCookie("jwt", {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
});
exports.logout = logout;

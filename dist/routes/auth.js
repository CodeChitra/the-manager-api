"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const router = express_1.default.Router();
router.route("/login").post(auth_controllers_1.login);
router.route("/register").post(auth_controllers_1.register);
router.route("/logout").get(auth_controllers_1.logout);
router.route("/refresh").get(auth_controllers_1.refresh);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Username is required!"],
        lowercase: true,
        minlength: [3, "Username should contain atleast 3 characters."],
        maxlength: [40, "Username can not contain more than 40 characters."],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required!"],
        lowercase: true,
        unique: true,
        validate: {
            validator: (v) => validator_1.default.isEmail(v),
            message: "Please fill a valid email!",
        },
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;

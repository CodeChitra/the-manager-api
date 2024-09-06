"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Username is required!"],
        lowercase: true,
        minlength: [3, "Username should contain atleast 3 characters."],
        maxlength: [40, "Username can not contain more than 40 characters."],
    },
    age: {
        type: Number,
        required: [true, "Employee Age is required!"],
        min: [16, "Employee age can not be less than 16."],
        max: [60, "Employee age can not be greater than 60."],
    },
    role: {
        type: String,
        required: [true, "Employee Role is required!"],
        lowercase: true,
    },
    skills: {
        type: [String],
    },
    experience: {
        type: Number,
        required: [true, "Please provide Employee's work experience in days."],
        min: [0, "Please fill valid experience in years."],
        max: [60, "Please fill valid experience in years."],
        default: 0,
    },
    location: {
        trim: true,
        type: String,
        required: [true, "Plaes provide Employee's work location."],
        lowercase: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const Employee = mongoose_1.default.model("Employee", employeeSchema);
exports.default = Employee;

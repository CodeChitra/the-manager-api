"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Task name is required!"],
        lowercase: true,
        minlength: [3, "Task name should contain atleast 3 characters."],
        maxlength: [40, "Username can not contain more than 40 characters."],
    },
    description: {
        type: String,
        required: [true, "Please provide description for the task"],
        maxlength: [200, "Description can not exceed more than 200 characters."],
    },
    estimatedTime: {
        type: Number,
        required: [true, "Please provide estimated time in days."],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    createdFor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employee",
    },
}, { timestamps: true });
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;

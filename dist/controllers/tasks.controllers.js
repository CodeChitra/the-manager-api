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
exports.deleteTask = exports.updateTask = exports.getAllTasks = exports.createTask = void 0;
const task_schema_1 = __importDefault(require("../schema/task.schema"));
const http_status_codes_1 = require("http-status-codes");
const task_models_1 = __importDefault(require("../models/task.models"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = task_schema_1.default.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const newTask = Object.assign(Object.assign({}, req.body), { createdBy: req.userId, createdFor: id });
    yield task_models_1.default.create(newTask);
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ success: "Task created successfully!" });
});
exports.createTask = createTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id is pointing to the id of the employee
    const { id } = req.params;
    const query = task_models_1.default.find({ createdBy: req.userId, createdFor: id })
        .sort("-createdAt")
        .limit(10);
    const tasks = yield query;
    res.status(http_status_codes_1.StatusCodes.OK).json({ tasks, totalTasks: tasks.length });
});
exports.getAllTasks = getAllTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = task_schema_1.default.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    yield task_models_1.default.findOneAndUpdate({ _id: id, createdBy: req.userId }, req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: "Task updated successfully!" });
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id is pointing to the id of the task
    const { id } = req.params;
    yield task_models_1.default.findOneAndDelete({ _id: id, createdBy: req.userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: "Task deleted successfully!" });
});
exports.deleteTask = deleteTask;

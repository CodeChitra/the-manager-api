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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
    const { employeeId } = req.params;
    const result = task_schema_1.default.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const newTask = Object.assign(Object.assign({}, req.body), { createdBy: req.userId, createdFor: employeeId });
    yield task_models_1.default.create(newTask);
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ success: "Task created successfully!" });
});
exports.createTask = createTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id is pointing to the id of the employee
    const { employeeId } = req.params;
    const query = task_models_1.default.find({ createdBy: req.userId, createdFor: employeeId })
        .sort("-createdAt")
        .limit(10);
    const tasks = yield query;
    res.status(http_status_codes_1.StatusCodes.OK).json({ tasks, totalTasks: tasks.length });
});
exports.getAllTasks = getAllTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.params;
    const _a = req.body, { createdAt, updatedAt, _id: taskId } = _a, data = __rest(_a, ["createdAt", "updatedAt", "_id"]);
    console.log("Employee Id: ", employeeId);
    console.log("Task Id: ", taskId);
    const result = task_schema_1.default.safeParse(data);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const updatedTask = yield task_models_1.default.findOneAndUpdate({ _id: taskId, createdFor: employeeId, createdBy: req.userId }, data, { new: true, runValidators: true });
    if (!updatedTask) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            success: "Task not found!",
        });
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: "Task updated successfully!", updatedTask });
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id is pointing to the id of the task
    const { employeeId, taskId } = req.params;
    yield task_models_1.default.findOneAndDelete({
        _id: taskId,
        createdFor: employeeId,
        createdBy: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: "Task deleted successfully!" });
});
exports.deleteTask = deleteTask;

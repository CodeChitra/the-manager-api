"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasks_controllers_1 = require("../controllers/tasks.controllers");
const router = express_1.default.Router();
router.route("/:id").get(tasks_controllers_1.getAllTasks).post(tasks_controllers_1.createTask);
router.route("/:id").patch(tasks_controllers_1.updateTask).delete(tasks_controllers_1.deleteTask);
exports.default = router;

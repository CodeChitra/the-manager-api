"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employees_controllers_1 = require("../controllers/employees.controllers");
const router = express_1.default.Router();
router.route("/").get(employees_controllers_1.getAllEmployees).post(employees_controllers_1.createEmployee);
router
    .route("/:id")
    .get(employees_controllers_1.getEmployee)
    .put(employees_controllers_1.updateEmployee)
    .delete(employees_controllers_1.deleteEmployee);
exports.default = router;

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
exports.deleteEmployee = exports.updateEmployee = exports.getEmployee = exports.getAllEmployees = exports.createEmployee = void 0;
const employee_schema_1 = require("../schema/employee.schema");
const http_status_codes_1 = require("http-status-codes");
const employee_models_1 = __importDefault(require("../models/employee.models"));
//! Create New Employee
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = employee_schema_1.employeeCreateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const newEmployee = Object.assign(Object.assign({}, req.body), { createdBy: req.userId });
    const employee = yield employee_models_1.default.create(newEmployee);
    console.log(employee);
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ success: "Employee created successfully!" });
});
exports.createEmployee = createEmployee;
//! Get All Employees
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, sortBy = "experience", sortOrder = "asc", location, tag, role, } = req.query;
    const queryObject = {
        createdBy: req.userId,
    };
    // searching
    if (search) {
        queryObject.name = { $regex: search, $options: "i" };
    }
    if (role) {
        queryObject.role = { $regex: role, $options: "i" };
    }
    // filtering
    if (location) {
        queryObject.location = location;
    }
    let query = employee_models_1.default.find(queryObject);
    // sorting
    if (sortBy === "age" || sortBy === "experience") {
        if (sortOrder === "asc") {
            query = query.sort(`${sortBy}`);
        }
        else if (sortOrder === "dsc") {
            query = query.sort(`-${sortBy}`);
        }
    }
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const employees = yield query;
    const totalEmployees = yield employee_models_1.default.countDocuments(queryObject);
    res.status(http_status_codes_1.StatusCodes.OK).json({ employees, totalEmployees });
});
exports.getAllEmployees = getAllEmployees;
//! Get Single Employee Detail
const getEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const employee = yield employee_models_1.default.findOne({ createdBy: req.userId, _id: id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ employee });
});
exports.getEmployee = getEmployee;
//! Update A Employee
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = employee_schema_1.employeeCreateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }
    const { id } = req.params;
    yield employee_models_1.default.findOneAndUpdate({ _id: id, createdBy: req.userId }, req.body, {
        new: true,
        runValidators: true,
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: "Employee details updated successfully!" });
});
exports.updateEmployee = updateEmployee;
//! Delete A Employee
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield employee_models_1.default.findOneAndDelete({ _id: id, createdBy: req.userId });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: "Employee deleted successfully!" });
});
exports.deleteEmployee = deleteEmployee;

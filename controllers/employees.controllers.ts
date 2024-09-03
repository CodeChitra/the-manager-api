import { Request, Response } from "express";
import { employeeCreateSchema } from "../schema/employee.schema";
import { StatusCodes } from "http-status-codes";
import Employee from "../models/employee.models";

//! Create New Employee
const createEmployee = async (req: Request, res: Response) => {
  const result = employeeCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const newEmployee = { ...req.body, createdBy: req.userId };
  const employee = await Employee.create(newEmployee);
  console.log(employee);

  res
    .status(StatusCodes.CREATED)
    .json({ success: "Employee created successfully!" });
};

//! Get All Employees
const getAllEmployees = async (req: Request, res: Response) => {
  const {
    search,
    sortBy = "experience",
    sortOrder = "asc",
    location,
    tag,
    role,
  } = req.query;

  const queryObject: any = {
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

  let query = Employee.find(queryObject);
  // sorting
  if (sortBy === "age" || sortBy === "experience") {
    if (sortOrder === "asc") {
      query = query.sort(`${sortBy}`);
    } else if (sortOrder === "dsc") {
      query = query.sort(`-${sortBy}`);
    }
  }
  // pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const employees = await query;
  const totalEmployees = await Employee.countDocuments(queryObject);
  res.status(StatusCodes.OK).json({ employees, totalEmployees });
};

//! Get Single Employee Detail
const getEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await Employee.findOne({ createdBy: req.userId, _id: id });
  res.status(StatusCodes.OK).json({ employee });
};

//! Update A Employee
const updateEmployee = async (req: Request, res: Response) => {
  const result = employeeCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }
  const { id } = req.params;
  await Employee.findOneAndUpdate(
    { _id: id, createdBy: req.userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ success: "Employee details updated successfully!" });
};

//! Delete A Employee
const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Employee.findOneAndDelete({ _id: id, createdBy: req.userId });
  res
    .status(StatusCodes.OK)
    .json({ success: "Employee deleted successfully!" });
};

export {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};

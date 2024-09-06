import { Request, Response } from "express";
import taskCreateSchema from "../schema/task.schema";
import { StatusCodes } from "http-status-codes";
import Task from "../models/task.models";

const createTask = async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const result = taskCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const newTask = {
    ...req.body,
    createdBy: req.userId,
    createdFor: employeeId,
  };
  await Task.create(newTask);
  res
    .status(StatusCodes.CREATED)
    .json({ success: "Task created successfully!" });
};

const getAllTasks = async (req: Request, res: Response) => {
  // id is pointing to the id of the employee
  const { employeeId } = req.params;
  const query = Task.find({ createdBy: req.userId, createdFor: employeeId })
    .sort("-createdAt")
    .limit(10);
  const tasks = await query;
  res.status(StatusCodes.OK).json({ tasks, totalTasks: tasks.length });
};

const updateTask = async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const { createdAt, updatedAt, _id: taskId, ...data } = req.body;
  console.log("Employee Id: ", employeeId);
  console.log("Task Id: ", taskId);

  const result = taskCreateSchema.safeParse(data);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, createdFor: employeeId, createdBy: req.userId },
    data,
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: "Task not found!",
    });
  }
  res
    .status(StatusCodes.OK)
    .json({ success: "Task updated successfully!", updatedTask });
};

const deleteTask = async (req: Request, res: Response) => {
  // id is pointing to the id of the task
  const { employeeId, taskId } = req.params;
  await Task.findOneAndDelete({
    _id: taskId,
    createdFor: employeeId,
    createdBy: req.userId,
  });
  res.status(StatusCodes.OK).json({ success: "Task deleted successfully!" });
};
export { createTask, getAllTasks, updateTask, deleteTask };

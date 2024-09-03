import { Request, Response } from "express";
import taskCreateSchema from "../schema/task.schema";
import { StatusCodes } from "http-status-codes";
import Task from "../models/task.models";

const createTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = taskCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const newTask = { ...req.body, createdBy: req.userId, createdFor: id };
  await Task.create(newTask);
  res
    .status(StatusCodes.CREATED)
    .json({ success: "Task created successfully!" });
};

const getAllTasks = async (req: Request, res: Response) => {
  // id is pointing to the id of the employee
  const { id } = req.params;
  const query = Task.find({ createdBy: req.userId, createdFor: id })
    .sort("-createdAt")
    .limit(10);
  const tasks = await query;
  res.status(StatusCodes.OK).json({ tasks, totalTasks: tasks.length });
};

const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = taskCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  await Task.findOneAndUpdate({ _id: id, createdBy: req.userId }, req.body);
  res.status(StatusCodes.OK).json({ success: "Task updated successfully!" });
};

const deleteTask = async (req: Request, res: Response) => {
  // id is pointing to the id of the task
  const { id } = req.params;
  await Task.findOneAndDelete({ _id: id, createdBy: req.userId });
  res.status(StatusCodes.OK).json({ success: "Task deleted successfully!" });
};
export { createTask, getAllTasks, updateTask, deleteTask };

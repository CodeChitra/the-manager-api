import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/tasks.controllers";

const router = express.Router();

router.route("/:employeeId").get(getAllTasks).post(createTask);
router.route("/:employeeId").put(updateTask);
router.route("/:employeeId/:taskId").delete(deleteTask);

export default router;

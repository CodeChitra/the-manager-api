import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/tasks.controllers";

const router = express.Router();

router.route("/:id").get(getAllTasks).post(createTask);
router.route("/:id").patch(updateTask).delete(deleteTask);

export default router;

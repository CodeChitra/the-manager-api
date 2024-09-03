import mongoose from "mongoose";

interface ITask {
  name: string;
  description: string;
  estimatedTime: number;
  completed?: boolean;
  createdFor: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}
const taskSchema = new mongoose.Schema<ITask>(
  {
    name: {
      type: String,
      required: [true, "Task name is required!"],
      lowercase: true,
      minlength: [3, "Task name should contain atleast 3 characters."],
      maxlength: [20, "Username can not contain more than 40 characters."],
    },
    description: {
      type: String,
      required: [true, "Please provide description for the task"],
      maxlength: [200, "Description can not exceed more than 200 characters."],
    },
    estimatedTime: {
      type: Number,
      required: [true, "Please provide estimated time in days."],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;

import { Types } from "mongoose";
import z from "zod";

// Custom ObjectId schema for MongoDB ObjectId validation
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

// Zod schema based on the Mongoose taskSchema
const taskCreateSchema = z.object({
  name: z
    .string()
    .min(3, "Task name should contain at least 3 characters.")
    .max(20, "Task name can not contain more than 20 characters.")
    .transform((val) => val.toLowerCase()),

  description: z
    .string({ required_error: "Please provide a description for the task" })
    .max(200, "Description can not exceed more than 200 characters."),

  estimatedTime: z
    .number()
    .min(0, "Estimated time must be a positive number.")
    .nonnegative("Estimated time must be a positive number."),

  completed: z.boolean().default(false),

  createdBy: objectIdSchema.optional(),
  createdFor: objectIdSchema.optional(),

  createdAt: z.date().optional(), // Zod will handle this when using with timestamps
  updatedAt: z.date().optional(),
});

export default taskCreateSchema;

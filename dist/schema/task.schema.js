"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
// Custom ObjectId schema for MongoDB ObjectId validation
const objectIdSchema = zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
// Zod schema based on the Mongoose taskSchema
const taskCreateSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(3, "Task name should contain at least 3 characters.")
        .max(20, "Task name can not contain more than 20 characters.")
        .transform((val) => val.toLowerCase()),
    description: zod_1.default
        .string({ required_error: "Please provide a description for the task" })
        .max(200, "Description can not exceed more than 200 characters."),
    estimatedTime: zod_1.default
        .number()
        .min(0, "Estimated time must be a positive number.")
        .nonnegative("Estimated time must be a positive number."),
    completed: zod_1.default.boolean().default(false),
    createdBy: objectIdSchema.optional(),
    createdFor: objectIdSchema.optional(),
    createdAt: zod_1.default.date().optional(), // Zod will handle this when using with timestamps
    updatedAt: zod_1.default.date().optional(),
});
exports.default = taskCreateSchema;

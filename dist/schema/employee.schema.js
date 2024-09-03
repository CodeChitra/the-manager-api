"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeCreateSchema = void 0;
const zod_1 = require("zod");
const employeeCreateSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required!" })
        .trim()
        .min(3, { message: "Username should contain at least 3 characters." })
        .max(40, { message: "Username can not contain more than 40 characters." })
        .toLowerCase(),
    age: zod_1.z
        .number({ required_error: "Age is required!" })
        .min(16, { message: "Employee age cannot be less than 16." })
        .max(60, { message: "Employee age cannot be greater than 60." }),
    role: zod_1.z.string().trim().toLowerCase(),
    skills: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "At least one skill is required." })
        .max(8, { message: "No more than 8 skills are allowed." }),
    experience: zod_1.z
        .number()
        .min(0, { message: "Please fill valid experience in days." })
        .max(60 * 365, { message: "Please fill valid experience in days." })
        .default(0),
    location: zod_1.z.string().trim().toLowerCase(),
});
exports.employeeCreateSchema = employeeCreateSchema;

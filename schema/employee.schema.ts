import { z } from "zod";

const employeeCreateSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .trim()
    .min(3, { message: "Username should contain at least 3 characters." })
    .max(40, { message: "Username can not contain more than 40 characters." })
    .toLowerCase(),

  age: z
    .number({ required_error: "Age is required!" })
    .min(16, { message: "Employee age cannot be less than 16." })
    .max(60, { message: "Employee age cannot be greater than 60." }),

  role: z.string().trim().toLowerCase(),

  skills: z
    .array(z.string())
    .min(1, { message: "At least one skill is required." })
    .max(8, { message: "No more than 8 skills are allowed." }),

  experience: z
    .number()
    .min(0, { message: "Please fill valid experience in days." })
    .max(60 * 365, { message: "Please fill valid experience in days." })
    .default(0),

  location: z.string().trim().toLowerCase(),
});

export { employeeCreateSchema };

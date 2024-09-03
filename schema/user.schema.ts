import z from "zod";

const passwordSchema = z
  .string({ required_error: "password is required!" })
  .min(6, "Password must be at least 6 characters long")
  .max(12, "Password must be at most 12 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");

const registerUserSchema = z.object({
  name: z
    .string({ required_error: "name is required!" })
    .min(3, "Username should contain atleast 3 characters.")
    .max(40, "Username can not contain more than 40 characters."),
  email: z
    .string({ required_error: "Email is required!" })
    .email("Please fill a valid email!"),
  password: passwordSchema,
});

const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export { registerUserSchema, loginUserSchema };

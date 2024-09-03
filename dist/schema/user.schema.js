"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const passwordSchema = zod_1.default
    .string({ required_error: "password is required!" })
    .min(6, "Password must be at least 6 characters long")
    .max(12, "Password must be at most 12 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character");
const registerUserSchema = zod_1.default.object({
    name: zod_1.default
        .string({ required_error: "name is required!" })
        .min(3, "Username should contain atleast 3 characters.")
        .max(40, "Username can not contain more than 40 characters."),
    email: zod_1.default
        .string({ required_error: "Email is required!" })
        .email("Please fill a valid email!"),
    password: passwordSchema,
});
exports.registerUserSchema = registerUserSchema;
const loginUserSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
});
exports.loginUserSchema = loginUserSchema;

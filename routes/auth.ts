import express from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controllers";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);
router.route("/refresh").get(refresh);

export default router;

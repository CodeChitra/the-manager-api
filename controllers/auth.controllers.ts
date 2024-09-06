import { Request, Response, NextFunction } from "express";
import { loginUserSchema, registerUserSchema } from "../schema/user.schema";
import User from "../models/user.models";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt, { VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const register = async (req: Request, res: Response) => {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const duplicate = await User.findOne({ email });
  if (duplicate) {
    res.sendStatus(StatusCodes.CONFLICT); //conflict
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, password: hashedPassword, email };

  await User.create(newUser);

  res.status(StatusCodes.CREATED).json({ success: `New user is created.` });
};

const login = async (req: Request, res: Response) => {
  const result = loginUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const { email, password: pwd } = req.body;
  const foundUser = await User.findOne({ email });

  // check if user exists
  if (!foundUser) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  // match password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (!match) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "password does not match!" });
  }

  // create access & refresh tokens
  const accessToken = jwt.sign(
    { userId: foundUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" } // 15 minutes
  );

  const refreshToken = jwt.sign(
    { userId: foundUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  await User.findByIdAndUpdate(foundUser._id, { refreshToken }, { new: true });
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
};

//! REFRESH
const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("Cookies: ", cookies);
  if (!cookies?.jwt) return res.sendStatus(StatusCodes.UNAUTHORIZED);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });
  console.log("Found user: ", foundUser);
  if (!foundUser) return res.sendStatus(StatusCodes.FORBIDDEN);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: VerifyErrors | null) => {
      if (err) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }
      const accessToken = jwt.sign(
        { userId: foundUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "900s" }
      );
      res.json({ accessToken });
    }
  );
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(StatusCodes.NO_CONTENT);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }

  await User.findByIdAndUpdate(
    foundUser._id,
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(StatusCodes.NO_CONTENT);
};
export { register, login, refresh, logout };

import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.message); // Log the error details to the console

  res.status(500).json({ msg: err.message });
};

export default errorHandlerMiddleware;

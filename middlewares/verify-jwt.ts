import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

interface IJwtPayload {
  userId: string;
}
const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"];
  if (!authorization || authorization?.split(" ")[0] !== "Bearer")
    return res.sendStatus(StatusCodes.UNAUTHORIZED);

  const accessToken = authorization.split(" ")[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }
    const payload = decoded as IJwtPayload;
    req.userId = payload.userId;
    next();
  });
};

export default verifyJwt;

import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/errors/AppError";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError("Missing authorization token", 401);
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new AppError("Invalid or expired token", 401));
  }
};

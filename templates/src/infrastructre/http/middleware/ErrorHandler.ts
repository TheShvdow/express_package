import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/errors/AppError";

export function ErrorHandler(err: any, req: Request, res: Response, _: NextFunction) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal Server Error" });
}

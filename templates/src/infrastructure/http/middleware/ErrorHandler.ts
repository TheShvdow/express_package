import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/errors/AppError";
import { logger } from "../../../utils/logger";

export function ErrorHandler(err: any, req: Request, res: Response, _: NextFunction) {
  const status = err instanceof AppError ? err.status : 500;
  const message = err instanceof AppError ? err.message : "Internal Server Error";

  logger.error({
    err,
    method: req.method,
    url: req.url,
    status,
  });

  return res.status(status).json({ error: message });
}

import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validator = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(422).json({ error: err.errors });
  }
};

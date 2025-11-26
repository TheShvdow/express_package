import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./infrastructre/http/routers/index";
import { ErrorHandler } from "./infrastructre/http/middleware/ErrorHandler";
// @swagger-import
import { setupSwagger } from "./core/swagger/swagger.config";
// @end-swagger-import

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // @swagger-setup
  setupSwagger(app);
  // @end-swagger-setup

  // Route de test
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      message: "API is running",
      documentation: "/api-docs",
      health: "/api/health",
    });
  });

  app.use("/api", router);

  app.use(ErrorHandler);

  return app;
};

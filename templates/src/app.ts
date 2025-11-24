import express from "express";
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

  app.use("/api", router);

  app.use(ErrorHandler);

  return app;
};

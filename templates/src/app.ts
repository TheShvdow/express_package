import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./infrastructure/http/routers/index";
import { ErrorHandler } from "./infrastructure/http/middleware/ErrorHandler";
// @swagger-import
import { setupSwagger } from "./core/swagger/swagger.config";
// @end-swagger-import

export const createApp = () => {
  const app = express();

  app.use(helmet());

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permettre les requêtes sans origin (curl, Postman, apps mobiles)
        if (!origin) return callback(null, true);
        if (!allowedOrigins || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      },
      credentials: true,
    }),
  );
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

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API Express générée automatiquement",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:{port}/api",
        description: "Serveur de développement",
        variables: {
          port: {
            default: "8000",
          },
        },
      },
      {
        url: "https://api.example.com",
        description: "Serveur de production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID unique de l'utilisateur",
            },
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
              minLength: 2,
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de mise à jour",
            },
          },
        },
        CreateUserInput: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
              minLength: 2,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
              example: "john.doe@example.com",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message d'erreur",
            },
            statusCode: {
              type: "integer",
              description: "Code de statut HTTP",
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message d'erreur de validation",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                  },
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Requête invalide",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        NotFound: {
          description: "Ressource non trouvée",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        ValidationError: {
          description: "Erreur de validation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
        Unauthorized: {
          description: "Non autorisé",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        InternalServerError: {
          description: "Erreur interne du serveur",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "Opérations liées aux utilisateurs",
      },
      {
        name: "Auth",
        description: "Authentification (register, login, profil)",
      },
    ],
  },
  apis: [
    "./src/infrastructure/http/routers/**/*.{ts,js}",
    "./src/core/swagger/schemas/**/*.{ts,js}",
    "./dist/infrastructure/http/routers/**/*.js",
    "./dist/core/swagger/schemas/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Log pour déboguer
  console.log("🔍 Initializing Swagger...");
  console.log("📁 API paths:", options.apis);

  // Vérifier si la spec contient des routes
  const spec = swaggerSpec as Record<string, unknown>;
  if (spec && spec['paths']) {
    console.log("✅ Swagger spec loaded with", Object.keys(spec['paths'] as object).length, "routes");
  } else {
    console.warn("⚠️  No routes found in Swagger spec. Check your JSDoc comments.");
  }

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    })
  );

  // Endpoint JSON pour la spec OpenAPI
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger documentation available at http://localhost:8000/api-docs");
};

export { swaggerSpec };

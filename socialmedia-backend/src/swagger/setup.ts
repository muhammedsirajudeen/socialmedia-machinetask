import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import swaggerDefinition from "@swagger/docs/auth";

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [], // Path to your route files for documentation
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

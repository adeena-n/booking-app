import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.js";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "University Lab & Equipment Booking API",
      version: "1.0.0",
      description: "Backend API for lab and equipment booking.",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Lab: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Embedded Systems Lab" },
            capacity: { type: "integer", example: 30 },
            location: { type: "string", example: "Block B, Floor 2" },
            facilities: { type: "array", items: { type: "string" } },
            status: {
              type: "string",
              enum: ["Available", "Reserved", "In Use", "Maintenance", "Closed"],
            },
          },
        },
        LabInput: {
          type: "object",
          required: ["name", "capacity"],
          properties: {
            name: { type: "string", example: "Embedded Systems Lab" },
            capacity: { type: "integer", example: 30 },
            location: { type: "string", example: "Block B, Floor 2" },
            facilities: { type: "array", items: { type: "string" } },
            status: {
              type: "string",
              enum: ["Available", "Reserved", "In Use", "Maintenance", "Closed"],
            },
            departmentId: { type: "string", format: "uuid" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string" },
                details: { type: "object" },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
});
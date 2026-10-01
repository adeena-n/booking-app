import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import labRoutes from "./routes/lab.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import bookingRoutes from "./routes/booking.routes.js";


export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

// Mount the route files
app.use("/api/auth", authRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/bookings", bookingRoutes);

// API documentation
app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// These two must always be last
app.use(notFound);
app.use(errorHandler);
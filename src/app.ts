import express from "express";
import bookingRoutes from "./routes/bookingRoute";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();

app.use(express.json());
app.use("/api/bookings", bookingRoutes);

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Raw JSON for CI or tooling
app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));

// Log that swagger middleware is mounted (useful in dev)
console.log("🔍 Swagger UI mounted at /api/docs and /api/docs.json (when server is running)");

app.get("/health", (_, res) => {
  res.json({ status: "OK", message: "Booking API is running" });
});

export default app;
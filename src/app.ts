import express from "express";
import bookingRoutes from "./routes/bookingRoute";

const app = express();

app.use(express.json());
app.use("/api/bookings", bookingRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK", message: "Booking API is running" });
});

export default app;
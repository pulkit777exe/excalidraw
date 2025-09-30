import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import { prismaClient } from "@repo/db/client";
import { createErrorResponse } from "./utils/responses";

const PORT = parseInt(process.env.PORT || "3008", 10);
const app = express();

app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
    res.status(404).json(createErrorResponse("Route not found", 404));
});

// Global error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json(createErrorResponse("Internal server error", 500));
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prismaClient.$disconnect();
  process.exit(0);
});
process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await prismaClient.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import modelRoutes from "./routes/model.routes";
import schemaRoutes from "./routes/schema.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { NotFoundError } from "./utils/errors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Request parsing middleware
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize MongoDB connection before setting up routes
const initializeApp = async () => {
  try {
    // Connect to MongoDB and attach mongoose to app.locals
    await connectDB(app);

    // Routes
    app.use("/api/models", modelRoutes);
    app.use("/api/schemas", schemaRoutes);

    // 404 handler
    app.use((req, res, next) => {
      next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
    });

    // Error handler
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

// Start the application
initializeApp().catch((error) => {
  console.error("Application startup failed:", error);
  process.exit(1);
});

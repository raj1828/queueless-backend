import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes  from "./modules/auth/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* -------------------- Global Middlewares -------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);

/* -------------------- Health Check -------------------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "QueueLess API",
  });
});

/* -------------------- 404 Handler -------------------- */
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

/* -------------------- Error Handler -------------------- */
app.use(errorMiddleware);

export default app;

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import passwordRoutes from "./routes/passwords";
import userRoutes from "./routes/user";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

/* ================= SECURITY ================= */

// ✅ Helmet (secure headers)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ✅ CORS (FIXED FOR VERCEL + LOCAL)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://pass-vault-alpha.vercel.app", // 🔥 your frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ✅ Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

/* ================= BODY ================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);
app.use("/api/user", userRoutes);

/* ================= ROOT (IMPORTANT) ================= */

app.get("/", (req, res) => {
  res.send("PassVault Backend Running 🚀");
});

/* ================= HEALTH ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    time: new Date().toISOString(),
  });
});

/* ================= 404 ================= */

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= ERROR ================= */

app.use(errorHandler);

export default app;
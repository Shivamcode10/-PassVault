import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import passwordRoutes from './routes/passwords';
import userRoutes from './routes/user';
import { errorHandler } from './middleware/errorHandler';

const app = express();

/* ================= SECURITY ================= */

// ✅ Helmet (secure headers)
app.use(
  helmet({
    crossOriginResourcePolicy: false, // fix frontend issues
  })
);

// ✅ CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// ✅ Rate Limiter (GLOBAL)
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
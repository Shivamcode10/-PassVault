import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

// Load env
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // ✅ Connect DB (use your config function if exists)
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error("❌ Server error:", error);
    process.exit(1);
  }
};

// Global error handlers
process.on("unhandledRejection", (err: any) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err: any) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ✅ Use Render PORT
const PORT = process.env.PORT || 5000;

// 🚀 Start Server Function
const startServer = async () => {
  try {
    // ✅ Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");

    // ✅ Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

// 🔥 Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

// 🔥 Handle uncaught exceptions
process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Start server
startServer();
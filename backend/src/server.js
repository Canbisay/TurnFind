import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const start = async () => {
  await connectDB();
  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  // Close cleanly when Render restarts or stops the app
  const shutdown = async () => {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1); // let the host restart us in a clean state
});

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
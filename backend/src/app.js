import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true })); // one exact origin only
app.use(compression());
app.use(express.json({ limit: "10kb" })); // blocks huge payloads
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . keys (NoSQL injection)
if (env.nodeEnv !== "test") app.use(morgan("dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, try later" },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "TurnFind API is running" });
});

// Routes will be added here in the next phases

app.use(notFound);
app.use(errorHandler); // must be last

export default app;
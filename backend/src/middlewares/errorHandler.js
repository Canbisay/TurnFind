import { env } from "../config/env.js";

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

// Turns different kinds of errors into one clean JSON response
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id"; // e.g. /shops/abc instead of a real ObjectId
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "This record already exists";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired, please login again";
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON body";
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body too large";
  }

  // Unknown errors: log them, but never leak details to the client in production
  if (!err.isOperational && statusCode === 500) {
    console.error(err);
    if (env.nodeEnv === "production") message = "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv !== "production" && statusCode === 500 && { stack: err.stack }),
  });
};
// An error we throw on purpose, with the right HTTP status code
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // marks it as a "known" error, safe to show
  }
}
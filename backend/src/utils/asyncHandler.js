// Wraps an async controller so any error goes to the error middleware
// without writing try/catch in every controller.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  if (!result.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid request", result.error.flatten());
  }
  next();
};
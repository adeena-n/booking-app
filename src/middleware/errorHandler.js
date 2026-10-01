export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: status === 500 ? "Something went wrong" : err.message,
      details: err.details,
    },
  });
}
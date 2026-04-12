export const notFoundHandler = (request, response) => {
  response.status(404).json({
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
};

export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    message: error.message || 'Internal server error',
  });
};

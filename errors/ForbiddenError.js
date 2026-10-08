class ForbiddenError extends Error {
  constructor(message = 'You do not have permission to perform this action') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;

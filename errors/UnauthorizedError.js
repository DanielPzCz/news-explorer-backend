class UnauthorizedError extends Error {
  constructor(message = 'Authorization required') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;

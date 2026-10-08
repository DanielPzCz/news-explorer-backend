class ConflictError extends Error {
  constructor(message = 'That email address is already registered') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;

class BadRequestError extends Error {
  constructor(message = 'Invalid data provided') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;

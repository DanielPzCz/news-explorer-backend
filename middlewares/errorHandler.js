const { isCelebrateError } = require('celebrate');

const DEFAULT_ERROR_MESSAGE = 'An error has occurred on the server';
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const detail = err.details.get('body') || err.details.get('params') || err.details.get('query');

    return res.status(BAD_REQUEST).send({
      message: detail ? detail.message : 'Validation failed',
    });
  }

  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  return res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? DEFAULT_ERROR_MESSAGE : message,
  });
};

const winston = require('winston');
const expressWinston = require('express-winston');

const jsonFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: jsonFormat,
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: jsonFormat,
});

module.exports = { requestLogger, errorLogger };

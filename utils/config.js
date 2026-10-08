const { NODE_ENV, JWT_SECRET, PORT = 3000, DB_URL } = process.env;

const isProduction = NODE_ENV === 'production';

module.exports = {
  PORT,
  JWT_SECRET: isProduction ? JWT_SECRET : 'dev-secret-key',
  DB_URL: DB_URL || 'mongodb://localhost:27017/newsexplorerdb',
  JWT_EXPIRATION: '7d',
};

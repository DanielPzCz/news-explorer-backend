require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateSignUp, validateSignIn } = require('./middlewares/validators');
const NotFoundError = require('./errors/NotFoundError');
const { PORT, DB_URL } = require('./utils/config');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());

mongoose.connect(DB_URL);

app.use(requestLogger);

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

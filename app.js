require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { PORT, DB_URL } = require('./utils/config');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());

mongoose.connect(DB_URL);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error has occurred on the server' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

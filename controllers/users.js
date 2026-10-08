const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { JWT_SECRET, JWT_EXPIRATION } = require('../utils/config');

const SALT_ROUNDS = 10;
const DUPLICATE_KEY_CODE = 11000;
const WRONG_CREDENTIALS_MESSAGE = 'Incorrect email or password';

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('No user found with that id'))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === DUPLICATE_KEY_CODE) {
        return next(new ConflictError('That email address is already registered'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(WRONG_CREDENTIALS_MESSAGE);
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          throw new UnauthorizedError(WRONG_CREDENTIALS_MESSAGE);
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRATION,
        });

        return res.send({ token });
      });
    })
    .catch(next);
};

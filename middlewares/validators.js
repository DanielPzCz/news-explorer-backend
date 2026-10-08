const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.email');
};

const objectId = Joi.string().hex().length(24);

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
});

module.exports.validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL),
  }),
});

module.exports.validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: objectId.required(),
  }),
});

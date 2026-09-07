const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      const articleData = article.toObject();
      delete articleData.owner;
      res.status(201).send(articleData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select('+owner')
    .orFail(() => new NotFoundError('No article found with that id'))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError('You can only delete your own articles');
      }

      return article.deleteOne().then(() => {
        const articleData = article.toObject();
        delete articleData.owner;
        res.send(articleData);
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('The provided id is not valid'));
      }
      return next(err);
    });
};

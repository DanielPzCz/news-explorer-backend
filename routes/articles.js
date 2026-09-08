const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const {
  validateArticle,
  validateArticleId,
} = require('../middlewares/validators');

router.get('/', getArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:articleId', validateArticleId, deleteArticle);

module.exports = router;

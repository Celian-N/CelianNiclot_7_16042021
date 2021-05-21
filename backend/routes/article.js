const express = require('express');

const router = express.Router();

const article = require('../controllers/article');
const auth = require('../middleware/auth');

router.get('/', auth, article.getMetadata);

module.exports = router;

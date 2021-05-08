const express = require('express');

const router = express.Router();

const comments = require('../controllers/comments');
const auth = require('../middleware/auth');

router.get('/', auth, comments.findAll);

router.get('/:publicationId', auth, comments.findForPublication);

router.post('/:publicationId', auth, comments.create);

router.post('/', auth, comments.like);

router.put('/:commentId', auth, comments.update);

router.delete('/:commentId', auth, comments.delete);

module.exports = router;

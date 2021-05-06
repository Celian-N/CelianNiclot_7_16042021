const express = require('express');

const router = express.Router();

const comments = require('../controllers/comments');
const auth = require('../middleware/auth');

router.get('/', auth, comments.findAll);

router.get('/:publicationId', auth, comments.findOne);

router.post('/', auth, comments.create);

router.put('/:publicationId', auth, comments.update);

router.delete('/:publicationId', auth, comments.delete);

module.exports = router;

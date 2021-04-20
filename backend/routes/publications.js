const express = require('express');

const router = express.Router();

const publications = require('../controllers/publications');
const auth = require('../middleware/auth');

router.get('/', auth, publications.findAll);

router.post('/', auth, publications.create);

router.put('/:publicationId', auth, publications.update);

router.delete('/:publicationId', auth, publications.delete);

module.exports = router;

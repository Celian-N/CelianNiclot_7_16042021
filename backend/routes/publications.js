const express = require('express');

const router = express.Router();

const publications = require('../controllers/publications');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkFileSize = require('../middleware/checkFileSize');

router.get('/', auth, publications.findAll);

router.get('/:publicationId', auth, publications.findOne);

router.post('/', auth, multer, checkFileSize, publications.create);

router.post('/:publicationId', auth, publications.like);

router.put('/:publicationId', auth, multer, checkFileSize, publications.update);

router.delete('/:publicationId', auth, publications.delete);

module.exports = router;

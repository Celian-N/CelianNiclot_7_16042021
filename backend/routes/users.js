const express = require('express');

const router = express.Router();

const users = require('../controllers/users');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkFileSize = require('../middleware/checkFileSize');

// Retrieve all Users
router.get('/', users.findAll);

//Retrieve a single User with userId
router.get('/:userId', users.findOne);

// Update a User with userId
router.put('/:userId', auth, multer, checkFileSize, users.update);

// Delete a User with userId
router.delete('/:userId', auth, users.delete);

module.exports = router;

const express = require('express');

const router = express.Router();

const users = require('../controllers/users');

// Retrieve all Users
router.get('/', users.findAll);

//Retrieve a single User with customerId
router.get('/:userId', users.findOne);

// Update a User with customerId
router.put('/:userId', users.update);

// Delete a User with customerId
router.delete('/:userId', users.delete);

module.exports = router;

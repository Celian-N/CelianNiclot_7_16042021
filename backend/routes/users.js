const express = require('express')

const router = express.Router()

const users = require('../controllers/users')

  // Create a new User
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve a single User with customerId
  router.get("/:userId", users.findOne);

  // Update a User with customerId
  router.put("/:userId", users.update);

  // Delete a User with customerId
  router.delete("/:userId", users.delete);

  // Create a new User
  router.delete("/", users.deleteAll);

module.exports = router;

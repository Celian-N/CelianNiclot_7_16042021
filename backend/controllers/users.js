const User = require('../models/users.js');

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving users.',
      });
    else res.status(200).json(data);
  });
};

// Find a single User with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with id ${req.params.userId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Error retrieving User with id ' + req.params.userId,
        });
      }
    } else res.status(200).json(data);
  });
};

// Update a User identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  User.updateById(req.params.userId, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with id ${req.params.userId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Error updating User with id ' + req.params.userId,
        });
      }
    } else res.status(200).json(data);
  });
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          message: `Not found User with id ${req.params.userId}.`
        });
      } else {
        res.status(500).json({
          message: "Could not delete User with id " + req.params.userId
        });
      }
    } else res.status(200).json({ message: `User was deleted successfully!` });
  });
};
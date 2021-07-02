const bcrypt = require('bcrypt');

const User = require('../models/users.js');

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const search = req.query.search;
  User.getAll(search, (err, user) => {
    if (err)
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving users.',
      });
    else res.status(200).json(user);
  });
};

// Find a single User with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
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
    } else
      res.status(200).json({
        firstname: user.firstname,
        lastname: user.lastname,
        userPic: user.userPic,
        job: user.job,
      });
  });
};

// Find Me
exports.me = (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with id ${userId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Error retrieving User with id ' + userId,
        });
      }
    } else res.status(200).json(user);
  });
};

// Update a User identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  console.log('BODY :', req.body);
  console.log('FILE :', req.file);

  const userRequest = req.file
    ? {
        ...JSON.parse(req.body.user),
        userPic: `${req.protocol}://${req.get('host')}/${req.imagePath}/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.user) };

  if (req.body.password) {
    return bcrypt.hash(req.body.password, 10).then((hashPassword) => {
      const user = { ...userRequest, password: hashPassword };

      User.updateById(req.params.userId, user, (err, user) => {
        if (err) {
          if (err.kind === 'not_found') {
            return res.status(404).json({
              message: `Not found User with id ${req.params.userId}.`,
            });
          } else {
            return res.status(500).json({
              message: 'Error updating User with id ' + req.params.userId,
            });
          }
        } else {
          return res.status(200).json(user);
        }
      });
    });
  }

  User.updateById(req.params.userId, userRequest, (err, user) => {
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
    } else res.status(200).json(user);
  });
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with id ${req.params.userId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Could not delete User with id ' + req.params.userId,
        });
      }
    } else res.status(200).json({ message: `User was deleted successfully!` });
  });
};

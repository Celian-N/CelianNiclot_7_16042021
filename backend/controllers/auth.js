const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/users.js');
require('dotenv').config();

exports.signup = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  bcrypt.hash(req.body.password, 10).then((hashPassword) => {
    // Create a User
    const user = new User({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashPassword,
      active: true,
      job: req.body.job || '',
      creationDate: new Date(),
    });

    // Save User in the database
    User.create(user, (err, user) => {
      if (err) {
        if (err.kind === 'duplicate') {
          return res.status(500).json({
            message: 'duplicate_mail',
          });
        }
        return res.status(500).json({
          message:
            err.message || 'Some error occurred while creating the user.',
        });
      }
      return res.status(201).json(user);
    });
  });
};

exports.login = (req, res, next) => {
  User.findByEmail(req.body.email, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with email ${req.body.email}.`,
        });
      } else if (err.kind === 'banish') {
        return res.status(403).json({
          message: `You have been banish by administrator.`,
        });
      } else {
        res.status(500).json({
          message: 'Error retrieving User with email ' + req.body.email,
        });
      }
    } else {
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          return res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    }
  });
};

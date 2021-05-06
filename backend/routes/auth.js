const express = require('express');


const router = express.Router();

const auth = require('../controllers/auth');
const users = require('../controllers/users');

const authMiddleware = require('../middleware/auth');
const {
  loginValidationRules,
  validateLogin,
  signupValidationRules,
  validateSignup,
} = require('../middleware/formValidator');

router.post('/signup', signupValidationRules(), validateSignup, auth.signup);
router.post('/login', loginValidationRules(), validateLogin, auth.login);
//get Me
router.get('/me', authMiddleware, users.me);
module.exports = router;

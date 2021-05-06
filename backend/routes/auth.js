const express = require('express')

const router = express.Router();

const auth = require('../controllers/auth');
const users = require('../controllers/users');

const authMiddleware = require('../middleware/auth');


router.post('/signup', auth.signup);
router.post('/login', auth.login);
//get Me
router.get('/me', authMiddleware, users.me);
module.exports = router;
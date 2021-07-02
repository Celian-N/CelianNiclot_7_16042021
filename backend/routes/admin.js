const express = require('express');

const router = express.Router();

const admin = require('../controllers/admin');
const auth = require('../middleware/auth');
const isUserAdmin = require('../middleware/isUserAdmin');

router.get('/', auth, isUserAdmin, admin.getAllSignaled);

router.delete('/comment/:commentId', auth, isUserAdmin, admin.removeComment);

router.delete(
  '/publication/:publicationId',
  auth,
  isUserAdmin,
  admin.removePublication
);

router.post('/comment/:commentId', auth, isUserAdmin, admin.ignoreComment);

router.post(
  '/publication/:publicationId',
  auth,
  isUserAdmin,
  admin.ignorePublication
);

router.post('/ban/:userId', auth, isUserAdmin, admin.banUser);

router.post('/deban/:userId', auth, isUserAdmin, admin.debanUser);

module.exports = router;

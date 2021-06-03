

const { isUserAdmin } = require('../controllers/admin')

module.exports = (req, res, next) => {
  isUserAdmin(req, res, next)
};

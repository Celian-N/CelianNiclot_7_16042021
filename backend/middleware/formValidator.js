const { check, validationResult } = require('express-validator');

const loginValidationRules = () => {
  return [
    check('email', 'Your email is not valid').isEmail(),
    check('password', 'Password is not valid').isLength({ min: 8 }),
  ];
};

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const signupValidationRules = () => {
  return [
    check('email', 'Your email is not valid').isEmail(),
    check('password', 'Your password is not valid').isLength({ min: 8 }),
    check(
      'firstname',
      'Your firstname is required and must be 40 caracters max'
    ).isLength({ max: 40 }),
    check(
      'lastname',
      'Your lastname is required and must be 40 caracters max'
    ).isLength({ max: 40 }),
    check('job', 'Your job must be 80 caracters max')
      .optional()
      .isLength({ max: 80 }),
  ];
};

function validateSignup(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
}

module.exports = {
  loginValidationRules,
  validateLogin,
  signupValidationRules,
  validateSignup,
};

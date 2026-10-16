const { validationResult } = require('express-validator');

/**
 * Middleware that checks express-validator results.
 * Returns 400 with structured errors if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({
      success: false,
      message: messages[0], // Primary error for toasts
      errors: messages,     // All errors for forms
    });
  }
  next();
};

module.exports = validate;

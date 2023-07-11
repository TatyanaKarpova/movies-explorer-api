const { isCelebrateError } = require('celebrate');
const BadRequestError = require('../errors/badRequestError');
const { internalServerErrorMessage } = require('../utils/constants');

module.exports = ((err, req, res, next) => {
  let details;

  if (isCelebrateError(err)) {
    details = new BadRequestError(err.details.get('body'));
  } else {
    details = err;
  }

  const { statusCode = 500, message = internalServerErrorMessage } = details;
  res.status(statusCode).send({
    message,
  });
  next();
});

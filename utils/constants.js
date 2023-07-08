module.exports.successCode = 200;
module.exports.regex = /https?:\/\/(www)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]*/i;

module.exports.allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
];

module.exports.DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

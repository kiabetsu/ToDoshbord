const ApiErrors = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
  console.log('error', err.errors);
  console.log('message', err.message);
  console.log('err', err);
  if (err instanceof ApiErrors) {
    return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unexpected error' });
};

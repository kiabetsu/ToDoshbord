const ApiErrors = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
  console.log('ошибка мидлвеира!!!!!!!!!!', err);
  console.log('error message', err.message);
  console.log('error status', err.statusCode);
  console.log('error errors', err.errors);
  if (err instanceof ApiErrors) {
    return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unexpected error' });
};

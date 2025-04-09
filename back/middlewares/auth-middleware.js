const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  console.log('pluchil zapros');
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log('token ne proslali');
      return next(ApiError.Unauthorized());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      console.log('net tokena');

      return next(ApiError.Unauthorized());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      console.log('nepravilniy token');
      return next(ApiError.Unauthorized());
    }

    req.user = userData;
    next();
  } catch (e) {
    console.log('ERROR AUTHORITY', e);
    return next(ApiError.Unauthorized());
  }
};

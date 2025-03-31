module.exports = class ApiErrors extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static BadRequest(message, errors = []) {
    return new ApiErrors(400, message, errors);
  }

  static NotFound(message, errors = []) {
    return new ApiErrors(404, message, errors);
  }

  static Unauthorized() {
    return new ApiErrors(401, 'User not authorized');
  }
};

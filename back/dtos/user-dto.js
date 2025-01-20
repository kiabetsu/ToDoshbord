module.exports = class userDto {
  id;
  login;

  constructor(model) {
    this.id = model._id;
    this.login = model.login;
  }
};

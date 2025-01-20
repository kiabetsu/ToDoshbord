const userService = require('../service/user-service');
const { validationResult } = require('express-validator');

class userController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      }
      const { login, password } = req.body;
      const userData = await userService.registration(login, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
    } catch (error) {}
  }

  async logout(req, res, next) {
    try {
    } catch (error) {}
  }

  async getTasks(req, res, next) {
    try {
      res.json('work');
    } catch (error) {}
  }

  async refresh(req, res, next) {
    try {
    } catch (error) {}
  }
}

module.exports = new userController();

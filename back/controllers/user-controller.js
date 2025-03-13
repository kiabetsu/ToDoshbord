const tokenService = require('../service/token-service');
const userService = require('../service/user-service');
const { validationResult, cookie } = require('express-validator');

class userController {
  async registration(req, res, next) {
    try {
      const { username, password, email } = req.body;
      const newUser = await userService.registration(username, password, email);
      res.cookie('refreshToken', newUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await userService.login(username, password);
      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = tokenService.removeToken(req.cookies.refreshToken);
      res.clearCookie('refreshToken');
      res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req, res, next) {
    try {
      res.json('work');
    } catch (error) {
      next(error);
    }
  }

  async addTask(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new userController();

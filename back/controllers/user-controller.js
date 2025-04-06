const tokenService = require('../service/token-service');
const userService = require('../service/user-service');

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
      console.log('doby', req.body);
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
      res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new userController();

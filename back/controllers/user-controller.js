const tokenService = require('../service/token-service');
const userService = require('../service/user-service');
const TaskService = require('../service/task-service');
const { validationResult, cookie } = require('express-validator');
const db = require('../db');

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
      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req, res, next) {
    try {
      // const tasks = await db.query('SELECT * FROM tasks');
      const { id } = req.user;
      const tasks = await TaskService.getTasks(id);
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async addTask(req, res, next) {
    try {
      const user_id = req.user.id;
      const { summary, description, due_date } = req.body;
      const task = await TaskService.addTask(user_id, summary, description, due_date);
      return res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id, summary, description, due_date } = req.body;
      const task = await TaskService.updateTask(id, summary, description, due_date);
      return res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.body;
      const task = await TaskService.deleteTask(id);
      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new userController();

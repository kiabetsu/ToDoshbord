const UserModel = require('../modules/user-model');
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/user-dto');
const tokenService = require('./token-service');
const db = require('../db');
const ApiErrors = require('../exceptions/api-error');

class UserService {
  async registration(username, password, email) {
    const candidateEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (candidateEmail.rows.length != 0) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    const candidateUsername = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (candidateUsername.rows.length != 0) {
      throw ApiErrors.BadRequest(`Пользователь с именем ${username} уже существует`);
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const user = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashPassword],
    );

    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(username, password) {
    const user = await db.query('SELECT * FROM users where username = $1', [username]);
    if (!user.rows[0]) {
      throw ApiErrors.BadRequest('User with that username is not found');
    }
    const isPassEquals = await bcrypt.compare(password, user.rows[0].password);

    if (!isPassEquals) {
      throw ApiErrors.BadRequest('Wrong password');
    }
    const userDto = new UserDto(user.rows[0]);

    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async refresh(token) {
    const userData = tokenService.validateRefreshToken(token);
    const tokenFromDB = await tokenService.findToken(token);
    console.log('tokenFromDB', tokenFromDB);
    if (!userData || !tokenFromDB) {
      throw ApiErrors.Unauthorized();
    }
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userData.id]);
    console.log('user', user.rows[0]);
    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();

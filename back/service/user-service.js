const UserModel = require('../modules/user-model');
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/user-dto');
const tokenService = require('./token-service');

class UserService {
  async registration(login, password) {
    const candidate = await UserModel.findOne({ login });
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом ${login} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const user = await UserModel.create({ login: login, password: hashPassword });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();

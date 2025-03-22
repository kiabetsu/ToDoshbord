const jwt = require('jsonwebtoken');
const db = require('../db');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  async saveToken(id, token) {
    const findUser = await db.query('SELECT * FROM tokens WHERE user_id = $1', [id]);
    if (findUser.rows.length != 0) {
      const tokenUpdate = await db.query(
        'UPDATE tokens set refresh_token = $1 WHERE user_id = $2 RETURNING *',
        [token, id],
      );
      return tokenUpdate.rows[0];
    }
    await db.query('INSERT INTO tokens (user_id, refresh_token) VALUES ($1, $2) RETURNING *', [
      id,
      token,
    ]);
    const addedToken = await db.query('SELECT * FROM tokens WHERE user_id = $1', [id]);
    return addedToken.rows[0];
  }

  async removeToken(token) {
    const removeToken = await db.query('DELETE FROM TOKENS WHERE refresh_token = $1', [token]);
    return removeToken;
  }

  validateAccessToken(token) {
    try {
      const verify = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
      return verify;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const verify = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
      return verify;
    } catch (error) {
      return null;
    }
  }

  async findToken(token) {
    const findToken = await db.query('SELECT * FROM tokens WHERE refresh_token = $1', [token]);
    return findToken.rows[0];
  }
}

module.exports = new TokenService();

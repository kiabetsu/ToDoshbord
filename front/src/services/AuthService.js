const { default: axiosInstance } = require('../http');

export default class AuthService {
  static async registration(username, email, password) {
    return axiosInstance.post('/registration', { username, email, password });
  }

  static async login(username, password) {
    return axiosInstance.post('/login', { username, password });
  }

  static async logout() {
    return axiosInstance.post('/logout');
  }
}

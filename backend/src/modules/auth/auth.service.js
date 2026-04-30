const UserModel = require("./user.model");

class AuthService {
  async register(data) {
    const {
      firstName,
      lastName,
      email,
      password,
      birthDate,
      gender,
    } = data;

    if (password.length < 6) {
      throw new Error("Пароль короткий");
    }

    return await UserModel.createUser({
    firstName,
    lastName,
    email,
    password,
    birthDate,
    gender,
  });

  }

  async login(data) {
    return await UserModel.loginUser(data);
  }

}

module.exports = new AuthService();
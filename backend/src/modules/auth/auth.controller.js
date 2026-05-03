const AuthService = require("./auth.service");


class AuthController {
  async register(req, res) {
    try {
      console.log("REGISTER");
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      console.log("LOGIN");
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
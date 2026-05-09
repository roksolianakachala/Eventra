const ProfileService = require("./profile.service");

class ProfileController {
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await ProfileService.getProfile(userId);
      res.json(profile);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const updated = await ProfileService.updateProfile(userId, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new ProfileController();
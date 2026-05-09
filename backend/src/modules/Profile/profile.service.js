const ProfileModel = require("./profile.model");

class ProfileService {
  async updateProfile(userId, data) {
    return await ProfileModel.updateProfile(userId, data);
  }

  async getProfile(userId) {
    return await ProfileModel.getProfile(userId);
  }
}

module.exports = new ProfileService();
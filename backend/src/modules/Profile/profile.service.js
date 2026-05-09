const ProfileModel = require("./profile.model");

class ProfileService {
  async updateProfile(userId, data) {
    console.log("PROFILE SERVICE UPDATE PROFILE HIT");
    return await ProfileModel.updateProfile(userId, data);
  }

  async getProfile(userId) {
    console.log("PROFILE SERVICE GET PROFILE HIT");
    return await ProfileModel.getProfile(userId);
  }

  async getPublicProfiles(userId) {
    return await ProfileModel.getPublicProfiles(userId);
  }
}

module.exports = new ProfileService();

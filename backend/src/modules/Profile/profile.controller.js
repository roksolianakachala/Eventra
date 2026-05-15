const ProfileService = require("./profile.service");

class ProfileController {
  async getMyProfile(req, res) {
    try {

        console.log("GET PROFILE CONTROLLER HIT");
      const userId = req.user.id;
      const profile = await ProfileService.getProfile(userId);
      res.json(profile);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateMyProfile(req, res) {
    try {
        console.log("UPDATE PROFILE CONTROLLER HIT");
      const userId = req.user.id;
      const updated = await ProfileService.updateProfile(userId, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getPublicProfiles(req, res) {
    try {
      const userId = req.user.id;
      const profiles = await ProfileService.getPublicProfiles(userId);

      res.json({
        status: "success",
        data: profiles,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateAvatar(req, res) {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Файл не завантажено",
      });
    }

    const avatarUrl = await ProfileService.updateAvatar(
      userId,
      req.file
    );

    res.json({
      message: "Avatar updated",
      avatarUrl,
    });

    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async deleteMyAccount(req, res) {
  try {
    const userId = req.user.id;

    await ProfileService.deleteAccount(userId);

    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

}

module.exports = new ProfileController();

const router = require("express").Router();
const ProfileController = require("./profile.controller");
const authenticate = require("../../middleware/authenticate");

router.get("/me", authenticate, ProfileController.getMyProfile);
router.put("/me", authenticate, ProfileController.updateMyProfile);

module.exports = router;
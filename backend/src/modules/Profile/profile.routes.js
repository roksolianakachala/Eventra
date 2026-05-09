const router = require("express").Router();
const ProfileController = require("./profile.controller");
const authenticate = require("../../middlewares/auth.middleware");

router.get("/me", authenticate, ProfileController.getMyProfile);
router.put("/me", authenticate, ProfileController.updateMyProfile);
router.get("/", authenticate, ProfileController.getPublicProfiles);
// router.get("/me", ProfileController.getMyProfile);
// router.put("/me", ProfileController.updateMyProfile);


// router.put("/me", (req, res, next) => {
//   console.log("🔥 ROUTE HIT /api/profile/me");
//   next();
// }, ProfileController.updateMyProfile);
module.exports = router;

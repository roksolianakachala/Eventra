const router = require("express").Router();
const ProfileController = require("./profile.controller");
const authenticate = require("../../middlewares/auth.middleware");
const {
  supabaseAuth,
  supabaseAdmin,
} = require("../../config/db.config");

router.get("/me", authenticate, ProfileController.getMyProfile);
router.put("/me", authenticate, ProfileController.updateMyProfile);
router.get("/", authenticate, ProfileController.getPublicProfiles);
const upload = require("../../middlewares/upload.middleware");


router.put(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  ProfileController.updateAvatar
);

// router.put("/me", (req, res, next) => {
//   console.log("🔥 ROUTE HIT /api/profile/me");
//   next();
// }, ProfileController.updateMyProfile);

router.post("/interests", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Need authorization header" });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error) {
    return res.status(403).json({ message: error.message });
  }

  const userId = data.user.id;
  const { interestIds } = req.body;

  const rows = interestIds.map((interestId) => ({
    userId,
    interestId,
  }));

  const { error: insertError } = await supabaseAdmin
    .from("userInterests")
    .insert(rows);

  if (insertError) {
    return res.status(400).json({ message: insertError.message });
  }

  res.json({ message: "Interests saved" });
});


router.get("/interests/list", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("interestsList")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.json(data);
});


router.delete("/interests/:interestId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { interestId } = req.params;

  const { error } = await supabaseAdmin
    .from("userInterests")
    .delete()
    .eq("userId", userId)
    .eq("interestId", interestId);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.json({ message: "Interest removed" });
});



module.exports = router;

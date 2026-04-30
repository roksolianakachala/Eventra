const router = require("express").Router();
const AuthController = require("./auth.controller");
const {
  supabaseAuth,
  supabaseAdmin
} = require("../../config/db.config");

router.post("/register", AuthController.register);
// router.post("/login", AuthController.login);

router.get("/google", async (req, res) => {
  const { data, error } =
    await supabaseAuth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://eventra-for-events.netlify.app"
      }
    });

  if (error) return res.status(400).json(error);

  res.redirect(data.url);
});


router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  const { data, error } =
    await supabaseAuth.auth.exchangeCodeForSession(code);

  if (error) {
    console.log(error);
    return res.redirect("https://eventra-for-events.netlify.app");
  }

  const user = data.user;
  const meta = user.user_metadata || {};

  const firstName =
    meta.given_name ||
    meta.full_name?.split(" ")[0] ||
    "";

  const lastName =
    meta.family_name ||
    meta.full_name?.split(" ").slice(1).join(" ") ||
    "";

  const { error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName
      })
      .eq("id", user.id);

  console.log(profileError);

  res.redirect("https://eventra-for-events.netlify.app");
});

module.exports = router;
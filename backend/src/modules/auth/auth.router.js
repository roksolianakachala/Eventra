const router = require("express").Router();
const AuthController = require("./auth.controller");
const {
  supabaseAuth,
  supabaseAdmin
} = require("../../config/db.config");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://eventra-for-events.netlify.app";

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Need authorization header" });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error) {
    return res.status(403).json({ message: error.message });
  }

  res.json({ user: data.user });
});

router.get("/google", async (req, res) => {
  const { data, error } =
    await supabaseAuth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://eventra-j1tj.onrender.com/api/auth/google/callback"
      }
    });

  if (error) return res.status(400).json(error);

  res.redirect(data.url);
});


router.get("/google/callback", async (req, res) => {

  console.log("RECEIVED GOOGLE CALLBACK"); 

  const { code } = req.query;

  const { data, error } =
    await supabaseAuth.auth.exchangeCodeForSession(code);

  if (error) {
    console.log(error);
    const params = new URLSearchParams({
      error: error.message || "Google authorization failed",
    });

    return res.redirect(`${FRONTEND_URL}/auth/callback#${params.toString()}`);
  }

  const user = data.user;
  const token = data.session?.access_token;
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

  const params = new URLSearchParams({
    access_token: token || "",
    user: JSON.stringify({
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      fullName: meta.full_name || `${firstName} ${lastName}`.trim(),
    }),
  });

  res.redirect(`${FRONTEND_URL}/auth/callback#${params.toString()}`);
});

module.exports = router;

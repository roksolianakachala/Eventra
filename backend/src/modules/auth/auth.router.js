const router = require("express").Router();
const AuthController = require("./auth.controller");
const {
  supabaseAuth,
  supabaseAdmin
} = require("../../config/db.config");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://eventra-for-events.netlify.app";
const ALLOWED_FRONTEND_URLS = new Set([
  "http://localhost:3000",
  FRONTEND_URL,
].filter(Boolean));

function getFrontendUrl(value) {
  try {
    const url = new URL(value || FRONTEND_URL);
    return ALLOWED_FRONTEND_URLS.has(url.origin) ? url.origin : FRONTEND_URL;
  } catch {
    return FRONTEND_URL;
  }
}

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
  const frontendUrl = getFrontendUrl(req.query.frontend_url);
  const redirectTo = `${frontendUrl}/auth/callback`;
  const { data, error } =
    await supabaseAuth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      }
    });

  if (error) return res.status(400).json(error);

  res.redirect(data.url);
});


router.get("/google/callback", async (req, res) => {

  console.log("RECEIVED GOOGLE CALLBACK"); 

  const { code } = req.query;
  const frontendUrl = getFrontendUrl(req.query.frontend_url);

  if (!code) {
    const params = new URLSearchParams({
      error: "Google authorization code was not found",
    });

    return res.redirect(`${frontendUrl}/auth/callback#${params.toString()}`);
  }

  const { data, error } =
    await supabaseAuth.auth.exchangeCodeForSession(code);

  if (error) {
    console.log(error);
    const params = new URLSearchParams({
      error: error.message || "Google authorization failed",
    });

    return res.redirect(`${frontendUrl}/auth/callback#${params.toString()}`);
  }

  const user = data.user;
  const token = data.session?.access_token;
  const meta = user.user_metadata || {};

  const firstName =
    meta.given_name ||
    meta.name?.split(" ")[0] ||
    meta.full_name?.split(" ")[0] ||
    "";

  const lastName =
    meta.family_name ||
    meta.name?.split(" ").slice(1).join(" ") ||
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
      fullName: meta.full_name || meta.name || `${firstName} ${lastName}`.trim(),
      avatarUrl: meta.avatar_url || meta.picture || "",
    }),
  });

  res.redirect(`${frontendUrl}/auth/callback#${params.toString()}`);
});


router.get("/facebook", async (req, res) => {
  const frontendUrl = getFrontendUrl(req.query.frontend_url);

  const { data, error } =
    await supabaseAuth.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${process.env.BACKEND_URL}/auth/facebook/callback?frontend_url=${frontendUrl}`,
      },
    });

  if (error) return res.status(400).json(error);

  res.redirect(data.url);
});



router.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;
  const frontendUrl = getFrontendUrl(req.query.frontend_url);

  if (!code) {
    const params = new URLSearchParams({
      error: "Facebook authorization code was not found",
    });

    return res.redirect(`${frontendUrl}/auth/callback#${params.toString()}`);
  }

  const { data, error } =
    await supabaseAuth.auth.exchangeCodeForSession(code);

  if (error) {
    const params = new URLSearchParams({
      error: error.message || "Facebook authorization failed",
    });

    return res.redirect(`${frontendUrl}/auth/callback#${params.toString()}`);
  }

  const user = data.user;
  const token = data.session?.access_token;

  const meta = user.user_metadata || {};

  const fullName = meta.full_name || meta.name || "";

  const firstName = fullName.split(" ")[0] || "";
  const lastName = fullName.split(" ").slice(1).join(" ") || "";

  const { error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
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
      fullName,
      avatarUrl: meta.avatar_url || "",
    }),
  });

  res.redirect(`${frontendUrl}/auth/callback#${params.toString()}`);
});

module.exports = router;

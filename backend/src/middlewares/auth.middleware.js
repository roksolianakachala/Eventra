const { supabaseAuth } = require("../config/db.config");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Токен авторизації відсутній або має неправильний формат",
      });
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        message: error?.message || "Невірний токен",
      });
    }

    req.user = {
      id: user.id, // 👈 важливо
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message || "Помилка сервера при аутентифікації",
    });
  }
};

module.exports = authenticate;
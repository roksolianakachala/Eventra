const { supabaseAuth } = require("../config/db.config");

const authenticate = async (req, res, next) => {
  try { 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: error.message || "Токен авторизації відсутній або має неправильный формат" });
    }

    const token = authHeader.split(" ")[1];

    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: error.message || "Невірний токен" }); 
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message || "Помилка сервера при аутентифікації" });
  }
};

module.exports = authenticate;
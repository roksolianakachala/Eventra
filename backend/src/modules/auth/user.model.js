const { supabaseAuth } = require("../../config/db.config");

class UserModel {
  async createUser(data) {
    const {
      email,
      password,
      firstName,
      lastName,
      birthDate,
      gender,
    } = data;

    const { data: authData, error } =
  await supabaseAuth.auth.signUp({
    email,
    password,
  });

    console.log("AUTH DATA:", authData);
    console.log("AUTH ERROR:", error);

    if (error) throw new Error(error.message);

    return authData;
  }

  async loginUser(data) {
    const { email, password } = data;

    const { data: userData, error } =
      await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw new Error(error.message);

    return userData;
  }
}

module.exports = new UserModel();
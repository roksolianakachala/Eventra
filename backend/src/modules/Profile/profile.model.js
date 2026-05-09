const { supabaseAdmin } = require("../../config/db.config");

class ProfileModel {
  async updateProfile(userId, data) {
    const { data: result, error } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        bio: data.bio,
        location: data.location,
        interests: data.interests,
        updated_at: new Date(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return result;
  }

  async getProfile(userId) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }
}

module.exports = new ProfileModel();
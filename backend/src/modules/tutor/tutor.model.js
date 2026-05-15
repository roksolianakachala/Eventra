const { supabaseAdmin } = require("../../config/db.config");

class TutorModel {
  async createTutor(data) {
    const { data: tutor, error } = await supabaseAdmin
      .from("tutor")
      .upsert(
        {
          user_id: data.user_id,
          subject: data.subject,
          experience_years: data.experience_years,
          education: data.education,
          faculty: data.faculty,
          work_format: data.work_format,
          price_per_hour: data.price_per_hour,
          city: data.city,
          bio: data.bio,
          updated_at: new Date(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return tutor;
  }



  async getTutors() {
  const { data, error } = await supabaseAdmin
    .from("tutor")
    .select(`
      *,
      profiles (
        id,
        first_name,
        last_name,
        avatar_url,
        location
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
}

module.exports = new TutorModel();
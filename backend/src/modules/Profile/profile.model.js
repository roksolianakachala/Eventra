const { supabaseAdmin } = require("../../config/db.config");

class ProfileModel {
  normalizeProfile(profile) {
    const firstName = profile.first_name || profile.firstName || "";
    const lastName = profile.last_name || profile.lastName || "";
    const fullName =
      profile.full_name ||
      profile.name ||
      [firstName, lastName].filter(Boolean).join(" ") ||
      "Користувач Eventra";

    return {
      id: profile.id,
      firstName,
      lastName,
      fullName,
      name: fullName,
      email: profile.email || "",
      phone: profile.phone || "",
      avatarUrl: profile.avatar_url || profile.avatarUrl || "",
      avatar: fullName.charAt(0).toUpperCase() || "E",
      bio: profile.bio || "Поки немає опису профілю.",
      city: profile.city || "",
      country: profile.country || "",
      location:
        profile.location ||
        [profile.city, profile.country].filter(Boolean).join(", ") ||
        "",
      createdAt: profile.created_at,
    };
  }

  async updateProfile(userId, data) {
    const { data: result, error } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        bio: data.bio,
        location: data.location,
        updated_at: new Date(),
      })
      .eq("id", userId)
      .select()
      .maybeSingle();

    console.log("PROFILE DATA:", data);
    console.log("PROFILE ERROR:", error);

    if (error) throw new Error(error.message);

    return result;
  }

  async getProfile(userId) {
    console.log("GET PROFILE MODEL HIT");

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    const { data: userInterests, error: interestsError } = await supabaseAdmin
      .from("userInterests")
      .select(`
        interestId,
        interestsList (
          name
        )
      `)
      .eq("userId", userId);

    if (interestsError) {
      throw new Error(interestsError.message);
    }

    const interests = (userInterests || [])
      .map((item) => ({
        interestId: item.interestId,
        name: item.interestsList?.name,
    }))
    .filter((item) => item.name);

    return {
      ...profile,
      interests,
    };
  }

  async getPublicProfiles(currentUserId) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .neq("id", currentUserId);

    if (error) throw new Error(error.message);

    return (data || []).map((profile) => this.normalizeProfile(profile));
  }
}

module.exports = new ProfileModel();
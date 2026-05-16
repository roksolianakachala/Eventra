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
          name,
          type
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
        type: item.interestsList?.type,
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
    .select(`
      *,
      userInterests (
        interestId,
        interestsList (
          name,
          type
        )
      )
    `)
    .neq("id", currentUserId);

  if (error) throw new Error(error.message);

  return (data || []).map((profile) => {
    const normalizedProfile = this.normalizeProfile(profile);

    const interests = (profile.userInterests || [])
      .map((item) => item.interestsList?.name)
      .filter(Boolean);

    const interestTypes = [
      ...new Set(
        (profile.userInterests || [])
          .map((item) => item.interestsList?.type)
          .filter(Boolean)
      ),
    ];

    return {
      ...normalizedProfile,
      interests,
      interestTypes,
    };
  });
  }

  async updateAvatar(userId, file) {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      avatar_url: publicUrl,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return publicUrl;
  }

  async deleteAccount(userId) {
  const { error: tutorError } = await supabaseAdmin
    .from("tutor")
    .delete()
    .eq("user_id", userId);

  if (tutorError) throw new Error(tutorError.message);

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) throw new Error(profileError.message);

  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) throw new Error(authError.message);

  return true;
}

}

module.exports = new ProfileModel();
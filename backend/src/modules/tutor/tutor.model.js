const pool = require("../../config/db.config");

const createTutor = async (data) => {
  const {
    user_id,
    subject,
    experience_years,
    education,
    faculty,
    work_format,
    price_per_hour,
    city,
    bio,
  } = data;

  const result = await pool.query(
    `
    INSERT INTO tutor (
      user_id,
      subject,
      experience_years,
      education,
      faculty,
      work_format,
      price_per_hour,
      city,
      bio
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (user_id)
    DO UPDATE SET
      subject = EXCLUDED.subject,
      experience_years = EXCLUDED.experience_years,
      education = EXCLUDED.education,
      faculty = EXCLUDED.faculty,
      work_format = EXCLUDED.work_format,
      price_per_hour = EXCLUDED.price_per_hour,
      city = EXCLUDED.city,
      bio = EXCLUDED.bio,
      updated_at = now()
    RETURNING *;
    `,
    [
      user_id,
      subject,
      experience_years,
      education,
      faculty,
      work_format,
      price_per_hour,
      city,
      bio,
    ]
  );

  return result.rows[0];
};

module.exports = {
  createTutor,
};
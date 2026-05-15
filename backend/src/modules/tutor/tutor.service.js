const tutorModel = require("./tutor.model");

const createTutor = async (userId, body) => {
  return await tutorModel.createTutor({
    user_id: userId,
    subject: body.subject,
    experience_years: Number(body.experience_years),
    education: body.education,
    faculty: body.faculty || null,
    work_format: body.work_format,
    price_per_hour: Number(body.price_per_hour),
    city: body.city,
    bio: body.bio,
  });
};

module.exports = {
  createTutor,
};
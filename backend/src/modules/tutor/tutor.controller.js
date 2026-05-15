const tutorService = require("./tutor.service");

const createTutor = async (req, res) => {
  try {
    const userId = req.user.id;

    const tutor = await tutorService.createTutor(userId, req.body);

    res.status(201).json({
      message: "Tutor profile saved successfully",
      tutor,
    });
  } catch (error) {
    console.error("Create tutor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTutors = async (req, res) => {
  try {
    const tutors = await tutorService.getTutors();

    res.json(tutors);
  } catch (error) {
    console.error("Get tutors error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTutor,
  getTutors,
};
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

module.exports = {
  createTutor,
};
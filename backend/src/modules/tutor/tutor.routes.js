const express = require("express");
const router = express.Router();

const tutorController = require("./tutor.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/", authMiddleware, tutorController.createTutor);

module.exports = router;
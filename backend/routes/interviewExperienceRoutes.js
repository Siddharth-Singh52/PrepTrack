const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} = require("../controllers/interviewExperienceController");

router.get("/:applicationId", protect, getExperiences);

router.post("/", protect, createExperience);

router.put("/:id", protect, updateExperience);

router.delete("/:id", protect, deleteExperience);

module.exports = router;
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    updateProgress,
    updateNotes,
    getUserProgress,
} = require("../controllers/userProgressController");

router.get("/", protect, getUserProgress);

router.post("/", protect, updateProgress);

router.put("/notes", protect, updateNotes);

module.exports = router;
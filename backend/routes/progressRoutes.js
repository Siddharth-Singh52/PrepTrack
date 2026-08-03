const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { updateProgress, updateNotes, getUserProgress, toggleFavorite, getTodayRevisions } = require("../controllers/userProgressController");

router.get("/", protect, getUserProgress);

router.get("/today", protect, getTodayRevisions);

router.post("/", protect, updateProgress);

router.put("/notes", protect, updateNotes);

router.put("/favorite", protect, toggleFavorite);

module.exports = router;
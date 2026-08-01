const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getAllQuestions, searchQuestions, filterQuestions, getSingleQuestion } = require("../controllers/questionController");

router.get("/", protect, getAllQuestions);

router.get("/search", protect, searchQuestions);

router.get("/filter", protect, filterQuestions);

router.get("/:id", protect, getSingleQuestion);

module.exports = router;
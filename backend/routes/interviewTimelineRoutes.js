const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { addTimelineEvent, getTimeline, updateTimelineEvent, deleteTimelineEvent } = require("../controllers/interviewTimelineController");

router.post("/", protect, addTimelineEvent);

router.get("/:applicationId", protect, getTimeline);

router.put("/:id", protect, updateTimelineEvent);

router.delete("/:id", protect, deleteTimelineEvent);

module.exports = router;
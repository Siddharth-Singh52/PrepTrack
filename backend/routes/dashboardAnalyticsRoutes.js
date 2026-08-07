const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getDashboardAnalytics,
    getUpcomingDeadlines,
} = require("../controllers/dashboardAnalyticsController");


router.get("/", protect, getDashboardAnalytics);

router.get("/deadlines", protect, getUpcomingDeadlines);

module.exports = router;
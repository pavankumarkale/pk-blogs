const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications,
} = require("../controllers/notificationController");

const {
  protect,
} = require("../middleware/authMiddleware");

// =============================
// Get Logged-in User Notifications
// =============================
router.get(
  "/",
  protect,
  getNotifications
);

// =============================
// Mark Notification as Read
// =============================
router.put(
  "/:id/read",
  protect,
  markAsRead
);

// =============================
// Delete One Notification
// =============================
router.delete(
  "/:id",
  protect,
  deleteNotification
);

// =============================
// Clear All Notifications
// =============================
router.delete(
  "/",
  protect,
  clearNotifications
);

module.exports = router;
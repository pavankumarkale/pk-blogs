const Notification = require("../models/Notification");

// ====================================
// Get Logged-in User Notifications
// ====================================

const getNotifications = async (req, res) => {

  try {

    const notifications = await Notification.find({
      recipient: req.user._id,
    })

      .populate("sender", "name")

      .populate("post", "title _id")

      .sort({ createdAt: -1 });

    res.status(200).json(notifications);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ====================================
// Mark Notification as Read
// ====================================

const markAsRead = async (req, res) => {

  try {

    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {

      return res.status(404).json({
        message: "Notification not found",
      });

    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ====================================
// Delete Notification
// ====================================

const deleteNotification = async (req, res) => {

  try {

    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {

      return res.status(404).json({
        message: "Notification not found",
      });

    }

    await notification.deleteOne();

    res.status(200).json({
      message: "Notification deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ====================================
// Clear All Notifications
// ====================================

const clearNotifications = async (req, res) => {

  try {

    await Notification.deleteMany({
      recipient: req.user._id,
    });

    res.status(200).json({
      message: "All notifications cleared",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {

  getNotifications,

  markAsRead,

  deleteNotification,

  clearNotifications,

};
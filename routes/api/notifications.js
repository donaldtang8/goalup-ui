const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
var validUrl = require("valid-url");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

// @route   GET api/notifications /
// @desc    Get all notifications of user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const allNotifications = await Notification.find()
      .sort({ date: -1 })
      .populate("user_from", ["name", "avatar", "username", "email"]);
    const notifications = allNotifications.filter(
      notif => notif.user_to.toString() === req.user.id
    );
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/notification/:userId
// @desc    Create new notification
// @access  Private
router.post(
  "/:userId/:itemId",
  [
    auth,
    [
      check("message", "Message is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newNotification = new Notification({
        user_to: req.params.userId,
        user_from: req.user.id,
        item_id: req.params.itemId,
        message: req.body.message
      });

      const notification = await newNotification.save();
      user.notifications.unshift({ notification });
      await user.save();
      res.json(notification);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/notification/viewed/:id
// @desc    Update view attribute for notification
// @access  Private
router.put("/viewed/:id", auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    // if there is a profile, update it
    if (notification) {
      notification = await Notification.findOneAndUpdate({ viewed: true });
      return res.json(notification);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/notification/opened/:id
// @desc    Update view attribute for notification
// @access  Private
router.put("/opened/:id", auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    // if there is a profile, update it
    if (notification) {
      notification = await Notification.findOneAndUpdate({ opened: true });
      return res.json(notification);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/notification/:id
// @desc    Delete notification
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    // if notification is not owned by req.user.id, user is not authorized
    if (notification.user_to.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    const userFrom = await User.findById(req.user.id);
    // remove notification from user_from's notifications
    const notifRemoveIndex = userFrom.notifications
      .map(notif => notif._id)
      .indexOf(req.params.id);
    userFrom.notifications.splice(notifRemoveIndex, 1);
    await notification.remove();
    await userFrom.save();
    res.json(userFrom.notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

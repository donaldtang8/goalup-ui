require("dotenv").config();
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Notification = require("../../models/Notification");
const _ = require("lodash");

// @route   GET api/users
// @desc    Get user
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // see if user exists
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "username",
      "Please include a username of 3 or more characters"
    ).isLength({ min: 3 }),
    check(
      "password",
      "Please enter a password of 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { name, email, username, password } = req.body;
    try {
      username = _.toLower(username);
      email = _.toLower(email);
      // see if user exists
      let userByEmail = await User.findOne({ email: email });
      if (userByEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      let userByUsername = await User.findOne({ username: username });
      if (userByUsername) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Username not available" }] });
      }
      // get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      // create new user
      user = new User({
        name,
        email,
        username,
        avatar,
        password
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user
      await user.save();

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/users/follow/:userId
// @desc    Follow or unfollow other users by id
// @access  Public
router.post("/follow/:userId", auth, async (req, res) => {
  try {
    // see if user exists
    let userFrom = await User.findById(req.user.id).select("-password");
    let userTo = await User.findById(req.params.userId).select("-password");
    let userToProfile = await Profile.findOne({
      user: req.params.userId
    }).populate("user", [
      "name",
      "username",
      "email",
      "avatar",
      "followers",
      "following"
    ]);
    let userFromProfile = await Profile.findOne({ user: req.user.id });

    if (!userTo || !userToProfile) {
      return res.status(400).json({ errors: [{ msg: "User does not exist" }] });
    }

    // if following user already
    if (
      userTo.followers.filter(
        follower => follower.user.toString() === req.user.id
      ).length > 0
    ) {
      //remove self from user.followers
      const userToRemoveIndex = userTo.followers
        .map(follower => follower.user.toString())
        .indexOf(req.user.id);
      userTo.followers.splice(userToRemoveIndex, 1);
      // remove user from self.following
      const userFromRemoveIndex = userFrom.following
        .map(follow => follow.user.toString())
        .indexOf(req.params.userId);
      userFrom.following.splice(userFromRemoveIndex, 1);
      // remove follower from user's profile
      const userToProfileRemoveIndex = userToProfile.followers
        .map(follower => follower.user.toString())
        .indexOf(req.user.id);
      userToProfile.followers.splice(userToProfileRemoveIndex, 1);
      // remove user from self profile
      const userFromProfileRemoveIndex = userFromProfile.followers
        .map(follower => follower.user.toString())
        .indexOf(req.params.userId);
      userFromProfile.following.splice(userFromProfileRemoveIndex, 1);
    } else {
      // otherwise if not following
      // create new notification for follow request
      const messageString = userFrom.name + " sent you a follow request";
      const notification = new Notification({
        user_from: req.user.id,
        user_to: req.params.userId,
        item_id: req.params.userId,
        action: "follow",
        message: messageString
      });
      await notification.save();
      // add to user_to's follower received requests
      userTo.follower_received_requests.unshift({ user: req.user.id });
      // add to user_from's follower sent requests
      userFrom.follower_sent_requests.unshift({ user: req.params.userId });
    }
    await userTo.save();
    await userFrom.save();
    await userToProfile.save();
    await userFromProfile.save();
    res.json(userToProfile);
    // res.json({
    //   follow: [{ followers: user.followers }, { following: user.following }]
    // });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users/follow_response/:userId/:response
// @desc    Follow or unfollow other users by id
// @access  Private
router.post("/follow_response/:userId/", auth, async (req, res) => {
  try {
    let userFrom = await User.findById(req.user.id).select("-password");
    let userTo = await User.findById(req.params.userId).select("-password");
    let userToProfile = await Profile.findOne({
      user: req.params.userId
    }).populate("user", [
      "name",
      "username",
      "email",
      "avatar",
      "followers",
      "following"
    ]);
    let userFromProfile = await Profile.findOne({ user: req.user.id });
    // check if there is a request from userTo to userFrom
    // to do this, we should check userId's follower_sent_requests and see if req.user.id is in there
    // if not there, user is not authorized to respond to request
    if (
      userTo.follower_sent_requests.filter(
        follower => follower.user.toString() === req.user.id
      ).length === 0
    ) {
      return res.status(400).json({ errors: [{ msg: "User not authorized" }] });
    }
    // if friend request is accepted
    if (req.body.response === "accept") {
      // create new notification
      const messageString = userFrom.name + " accepted your friend request";
      const notification = new Notification({
        user_from: req.user.id,
        user_to: req.params.userId,
        item_id: req.params.userId,
        action: "follow_response",
        message: messageString
      });
      await notification.save();
      // unshift will add user to the front of the likes array of post
      userTo.followers.unshift({ user: req.user.id });
      userFrom.following.unshift({ user: req.params.userId });
      userToProfile.followers.unshift({ user: req.user.id });
      userFromProfile.following.unshift({ user: req.params.userId });
      // remove requests
      //remove received request from user's requests
      const userFromRemoveIndex = userFrom.follower_received_requests
        .map(follower => follower.user.toString())
        .indexOf(req.params.userId);
      userFrom.follower_received_requests.splice(userFromRemoveIndex, 1);
      // remove sent request from other user's requests
      const userToRemoveIndex = userTo.follower_sent_requests
        .map(follow => follow.user.toString())
        .indexOf(req.user.id);
      userTo.follower_sent_requests.splice(userToRemoveIndex, 1);
    } else {
      // create new notification
      const messageString = userFrom.name + " rejected your friend request";
      const notification = new Notification({
        user_from: req.user.id,
        user_to: req.params.userId,
        item_id: req.params.userId,
        action: "follow_response",
        message: messageString
      });
      await notification.save();
      // remove requests
      //remove received request from user's requests
      const userFromRemoveIndex = userFrom.follower_received_requests
        .map(follower => follower.user.toString())
        .indexOf(req.params.userId);
      userFrom.follower_received_requests.splice(userFromRemoveIndex, 1);
      // remove sent request from other user's requests
      const userToRemoveIndex = userTo.follower_sent_requests
        .map(follow => follow.user.toString())
        .indexOf(req.user.id);
      userTo.follower_sent_requests.splice(userToRemoveIndex, 1);
    }
    await userTo.save();
    await userFrom.save();
    res.json(userFrom.follower_received_requests);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

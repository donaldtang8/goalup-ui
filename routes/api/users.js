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
    let user = await User.findOne({ _id: req.params.userId });
    let self = await User.findOne({ _id: req.user.id });
    let userProfile = await Profile.findOne({
      user: req.params.userId
    }).populate("user", [
      "name",
      "username",
      "email",
      "avatar",
      "followers",
      "following"
    ]);
    let selfProfile = await Profile.findOne({ user: req.user.id });

    if (!user || !userProfile) {
      return res.status(400).json({ errors: [{ msg: "User does not exist" }] });
    }

    // if following user already
    if (
      user.followers.filter(
        follower => follower.user.toString() === req.user.id
      ).length > 0
    ) {
      //remove self from user.followers
      const userRemoveIndex = user.followers
        .map(follower => follower.user.toString())
        .indexOf(req.user.id);
      user.followers.splice(userRemoveIndex, 1);
      // remove user from self.following
      const selfRemoveIndex = self.following
        .map(follow => follow.user.toString())
        .indexOf(req.params.userId);
      self.following.splice(selfRemoveIndex, 1);
      // remove follower from user's profile
      const userProfileRemoveIndex = userProfile.followers
        .map(follower => follower.user.toString())
        .indexOf(req.user.id);
      userProfile.followers.splice(userProfileRemoveIndex, 1);
      // remove user from self profile
      const selfProfileRemoveIndex = selfProfile.followers
        .map(follower => follower.user.toString())
        .indexOf(req.params.userId);
      selfProfile.following.splice(selfProfileRemoveIndex, 1);
    } else {
      // otherwise if not following
      // add self to user.followers
      // unshift will add user to the front of the likes array of post
      user.followers.unshift({ user: req.user.id });
      self.following.unshift({ user: req.params.userId });
      userProfile.followers.unshift({ user: req.user.id });
      selfProfile.following.unshift({ user: req.params.userId });
    }
    await user.save();
    await self.save();
    await userProfile.save();
    await selfProfile.save();
    res.json(userProfile);
    // res.json({
    //   follow: [{ followers: user.followers }, { following: user.following }]
    // });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

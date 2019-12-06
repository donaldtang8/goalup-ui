const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
var validUrl = require("valid-url");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate("User", [
        "name",
        "username",
        "email",
        "avatar",
        "followers",
        "following"
      ])
      .populate("posts.post");
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/profile
// @desc    Create or update a user's profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("bio", "Bio is required")
        .not()
        .isEmpty(),
      check("goal", "Goal is required")
        .not()
        .isEmpty(),
      check("status", "Bio is required")
        .not()
        .isEmpty(),
      check("location", "Bio is required")
        .not()
        .isEmpty(),
      check("hobbies", "Hobbies is required")
        .not()
        .isEmpty(),
      check("interests", "Interests is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      bio,
      website,
      location,
      status,
      goal,
      hobbies,
      interests,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (bio) profileFields.bio = bio;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (goal) profileFields.goal = goal;
    if (hobbies) {
      profileFields.hobbies = hobbies.split(",").map(hobby => hobby.trim());
    }
    if (interests) {
      profileFields.interests = interests
        .split(",")
        .map(interest => interest.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (website) {
        if (!validUrl.isUri(website)) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Please enter a valid url" }] });
        }
      }
      // if there is a profile, update it
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // if there is no profile, create a new one
      profile = new Profile(profileFields);
      await profile.save();

      let user = await User.findOne({ _id: req.user.id });
      user.hasProfile = true;
      await user.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "name",
      "username",
      "email",
      "avatar",
      "followers",
      "following",
      "groups"
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    })
      .populate("user", [
        "name",
        "username",
        "email",
        "avatar",
        "followers",
        "following"
      ])
      .populate("posts.post");
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    // for each user
    // if they are following user to be deleted, remove from their following list
    // for every user that user to be deleted follows, remove from the followed user's followers list

    let self = await User.findOne({ _id: req.user.id });
    // for each user that deleted user follows, go to that user's follower's list and remove deleted user
    self.following.map(follow => {
      let user = User.findOne({ _id: follow.user.toString() });
      const userRemoveIndex = user.followers
        .map(follower => follower.user.toString())
        .indexOf(req.user.id);
      user.followers.splice(userRemoveIndex, 1);
    });
    // for each user that follows deleted user, go that user's following list and remove deleted user
    self.followers.map(follower => {
      let user = User.findOne({ _id: follower.user.toString() });
      const userRemoveIndex = user.following
        .map(follow => follow.user.toString())
        .indexOf(req.user.id);
      user.following.splice(userRemoveIndex, 1);
    });

    self.hasProfile = false;
    await self.save();

    // Remove user posts if their account is deleted
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "Profile deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

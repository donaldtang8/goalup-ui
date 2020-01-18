const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Group = require("../../models/Group");
const Post = require("../../models/Post");

// @route   GET api/groups/
// @desc    Get all groups
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("creator", [
        "name",
        "username",
        "email",
        "avatar",
        "followers",
        "following"
      ])
      .populate("admins.user");
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/groups/me
// @desc    Get all joined groups
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("creator", [
        "name",
        "username",
        "email",
        "avatar",
        "followers",
        "following"
      ])
      .populate("admins.user")
      .populate("members.user");
    const joinedGroups = groups.filter(group =>
      group.members.filter(member => member.user === req.user.id)
    );
    res.json(joinedGroups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/groups/
// @desc    Create a group
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("description", "Description is required")
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
    const { name, description, hobbies, interests } = req.body;
    try {
      let user = await User.findOne({ _id: req.user.id });

      // create a new group
      const newGroup = new Group({
        name: name,
        description: description,
        hobbies: hobbies.split(",").map(hobby => hobby.trim()),
        interests: interests.split(",").map(interest => interest.trim()),
        creator: req.user.id,
        admins: [{ user: req.user.id }],
        members: [{ user: req.user.id }]
      });
      user.groups.unshift({ group: newGroup });
      const group = await newGroup.save();
      await user.save();
      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/groups/:groupId
// @desc    Update a group
// @access  Private
router.put(
  "/:groupId",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("description", "Description is required")
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
    let group = await Group.findOne({
      _id: req.params.groupId
    });
    if (!group) return res.status(400).json({ msg: "Group not found" });
    const { name, description, hobbies, interests } = req.body;
    const groupFields = {
      name: name,
      description: description,
      hobbies: hobbies,
      interests: interests
    };
    try {
      group = await Group.findOneAndUpdate(
        { _id: req.params.groupId },
        { $set: groupFields },
        { new: true }
      );
      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/groups/:groupId
// @desc     Get group by group ID
// @access   Public
router.get("/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("admins.user")
      .populate("members.user")
      .populate("posts.post");

    if (!group) return res.status(400).json({ msg: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Group not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/groups/join/:group_id
// @desc     Join group by id
// @access   Public
router.put("/join/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const self = await User.findOne({ _id: req.user.id });

    //  if user is already joined, then remove them
    if (!group) return res.status(400).json({ msg: "Group not found" });
    if (!self) return res.status(400).json({ msg: "User not found" });
    if (
      group.members.filter(member => member.user.toString() === req.user.id)
        .length > 0
    ) {
      const removeIndex = group.members
        .map(member => member.user.toString())
        .indexOf(req.user.id);
      group.members.splice(removeIndex, 1);
    } else {
      // unshift will add user to the front of the members array of group
      group.members.unshift({ user: req.user.id });
    }
    // add/remove group from user
    if (
      self.groups.filter(gp => gp.group.toString() === req.params.id).length > 0
    ) {
      const removeIndex = self.groups
        .map(gp => gp.group.toString())
        .indexOf(req.params.id);
      self.groups.splice(removeIndex, 1);
    } else {
      self.groups.unshift({ group: req.params.id });
    }

    await group.save();
    await self.save();

    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/groups/leave/:group_id
// @desc     Leave group by id
// @access   Public
router.put("/leave/:id", auth, async (req, res) => {
  try {
    // const group = await Group.findOne({ _id: req.params.id });
    const group = await Group.findById(req.params.id).populate("group", [
      "name",
      "description",
      "creator",
      "avatar",
      "posts",
      "members"
    ]);
    const user = await User.findOne({ _id: req.user.id });
    // Check if the post has already been liked
    // filter through the likes to see if current iteration of user is the one thats logged in
    // this will only return something if theres a match, so if > 0 that means user has already liked the post
    if (
      group.members.filter(member => member.user.toString() === req.user.id)
        .length > 0
    ) {
      const removeIndex = group.members
        .map(member => member.user.toString())
        .indexOf(req.user.id);
      group.members.splice(removeIndex, 1);
    } else {
      // unshift will add user to the front of the likes array of post
      group.members.unshift({ user: req.user.id });
    }

    if (
      user.groups.filter(gp => gp.group.toString() === req.params.id).length > 0
    ) {
      const removeIndex = user.groups
        .map(gp => gp.group.toString())
        .indexOf(req.params.id);
      user.groups.splice(removeIndex, 1);
    } else {
      user.groups.unshift({ group: req.params.id });
    }

    await group.save();
    await user.save();

    res.json(group.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/groups/:groupId/posts
// @desc    Get all group posts
// @access  Private
router.get("/:groupId/posts", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate(
      "posts.post"
    );
    if (group) res.json(group.posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/groups/:groupId
// @desc     Create a post in group
// @access   Public
router.post(
  "/:groupId",
  [
    auth,
    [
      check("postText", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const group = await Group.findOne({
        _id: req.params.groupId
      }).populate("posts.post");

      if (!group) return res.status(400).json({ msg: "Group not found" });

      // check if user is in group
      if (
        group.members.filter(member => member.user.toString() === req.user.id)
          .length > 0
      ) {
        const user = await User.findById(req.user.id).select("-password");
        const newPost = new Post({
          user: req.user.id,
          text: req.body.postText,
          name: user.name,
          avatar: user.avatar,
          group: req.params.groupId,
          private: true
        });
        const post = await newPost.save();
        group.posts.unshift({ post });
        await group.save();
        res.json(group.posts);
      } else {
        res.status(400).json({ msg: "User not authorized" });
      }
    } catch (err) {
      console.error(err.message);
      if (err.kind == "ObjectId") {
        return res.status(400).json({ msg: "Group not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/groups/:group_id/:postid
// @desc     Delete a group post
// @access   Private
router.delete("/:groupId/:postId", auth, async (req, res) => {
  try {
    // find group
    const group = await Group.findOne({
      _id: req.params.groupId
    });
    if (!group) return res.status(400).json({ msg: "Group not found" });
    // find post
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(400).json({ msg: "Post not found" });
    // check if user is authorized
    if (post.user.toString() !== req.user.id)
      return res.status(400).json({ msg: "User not authorized" });
    //remove post from group.posts
    const postRemoveIndex = group.posts
      .map(post => post.post)
      .indexOf(req.params.postId);
    group.posts.splice(postRemoveIndex, 1);

    await group.save();
    await post.remove();
    res.json(group.posts);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/groups/:groupId
// @desc     Delete group and all of its posts
// @access   Private
router.delete("/:groupId", auth, async (req, res) => {
  try {
    let group = await Group.findById(req.params.groupId);
    if (!group) return res.status(400).json({ msg: "No group found" });
    if (group.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    // for each all users in group (including creator and admins), remove group from user's group list
    const updateMemberGroups = async member => {
      let user = await User.findOne({ _id: member.user._id });
      user.groups.map(group => {
        const groupRemoveIndex = user.groups
          .map(group => group._id)
          .indexOf(req.params.groupId);
        user.groups.splice(groupRemoveIndex, 1);
      });
      await user.save();
    };

    const updateUserGroups = async => {
      return Promise.all(
        group.members.map(member => updateMemberGroups(member))
      );
    };

    await updateUserGroups();

    await Post.deleteMany({ group: req.params.groupId });

    await Group.findOneAndRemove({ _id: req.params.groupId });

    res.json({ msg: "Group deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

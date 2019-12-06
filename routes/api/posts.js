const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // sorts posts in most recent order
    const allPosts = await Post.find().sort({ date: -1 });
    const posts = allPosts.filter(post => post.private === false);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
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
      const user = await User.findById(req.user.id).select("-password");
      const profile = await Profile.findOne({ user: req.user.id });
      const newPost = new Post({
        text: req.body.postText,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      profile.posts.unshift({ post });
      await profile.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const profile = await Profile.findOne({ user: req.user.id });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    // Remove posts from profiles posts
    const postRemoveIndex = profile.posts
      .map(post => post.post.toString())
      .indexOf(req.params.id);
    profile.posts.splice(postRemoveIndex, 1);

    await post.remove();
    await profile.save();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    // filter through the likes to see if current iteration of user is the one thats logged in
    // this will only return something if theres a match, so if > 0 that means user has already liked the post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
    } else {
      // unshift will add user to the front of the likes array of post
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    // if length is 0, that means user has not liked the post, so they can't unlike the post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    post.isLiked = false;
    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("commentText", "Text is required")
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
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.commentText,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      console.log("Sending 404");
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      console.log("Sending 401");
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/comment/like/:postId/:commentId", auth, async (req, res) => {
  try {
    // get the post
    const post = await Post.findById(req.params.postId);
    // get the comment
    const com = post.comments.filter(
      comment => comment._id.toString() === req.params.commentId
    )[0];

    // Check if the comment has already been liked
    // filter through the likes to see if current iteration of user is the one thats logged in
    // this will only return something if theres a match, so if > 0 that means user has already liked the comment
    if (
      com.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      // Get remove index
      const removeIndex = com.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);

      com.likes.splice(removeIndex, 1);
    } else {
      // unshift will add user to the front of the likes array of post
      com.likes.unshift({ user: req.user.id });
    }

    await post.save();
    res.json(com.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/comments/unlike/:postId/:commentId
// @desc     Unlike a comment
// @access   Private
router.put("/comment/unlike/:postId/:commentId", auth, async (req, res) => {
  try {
    // get the post
    const post = await Post.findById(req.params.postId);
    // get the comment
    const com = post.comments.filter(
      comment => comment._id.toString() === req.params.commentId
    )[0];

    // Check if the post has already been liked
    // if length is 0, that means user has not liked the post, so they can't unlike the post
    if (
      com.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Comment has not yet been liked" });
    }

    // Get remove index
    const removeIndex = com.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    com.likes.splice(removeIndex, 1);

    await post.save();

    res.json(com.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

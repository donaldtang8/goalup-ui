const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const Notification = require("../../models/Notification");
const uuidv4 = require("uuid/v4");

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
    const userFrom = await User.findById(req.user.id).select("-password");
    const userTo = await User.findById(post.user).select("-password");

    // Check if the post has already been liked
    // filter through the likes to see if current iteration of user is the one thats logged in
    // this will only return something if theres a match, so if > 0 that means user has already liked the post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      // remove like from post
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);

      // find and remove notification
      const notification = await Notification.findOne({
        user_from: req.user.id,
        user_to: post.user,
        item_id: req.params.id,
        action: "like"
      });

      // if there is no notification that meet the requirements
      if (!notification) {
        return res.status(400).json({ msg: "Notification does not exist" });
      }

      // remove notification from user's notifications
      const removeNotifIndex = userTo.notifications
        .map(notif => notif.notification.toString())
        .indexOf(notification._id);
      userTo.notifications.splice(removeNotifIndex, 1);

      notification.remove();
    } else {
      // create notification
      const messageString = userFrom.name + " liked your post";
      const newNotification = new Notification({
        user_from: req.user.id,
        user_to: post.user,
        item_id: req.params.id,
        action: "like",
        message: messageString
      });
      // add notification to user
      userTo.notifications.unshift({
        notification: newNotification,
        user: {
          userId: req.user.id,
          avatar: userFrom.avatar,
          name: userFrom.name,
          username: userFrom.username,
          email: userFrom.email
        },
        item_id: req.params.id,
        action: "like",
        message: messageString,
        viewed: false,
        opened: false
      });
      await newNotification.save();
      // unshift will add user to the front of the likes array of post
      post.likes.unshift({ user: req.user.id });
    }

    await userTo.save();
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
    const userTo = await User.findById(post.user);

    // Check if the post has already been liked
    // if length is 0, that means user has not liked the post, so they can't unlike the post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    // remove like notification for post
    // find notification where userFrom is req.user.id and userTo is post.user and action is "like"
    const notification = await Notification.findOne({
      user_from: req.user.id,
      user_to: post.user,
      action: "like"
    });

    // if there is no notification that meet the requirements
    if (!notification) {
      return res.status(400).json({ msg: "Notification does not exist" });
    }

    //remove notification from user's notification list
    const userToRemoveIndex = user_to.notifications
      .map(notif => notif.notification.toString())
      .indexOf(notification._id);
    userTo.notifications.splice(userToRemoveIndex, 1);

    notification.remove();

    await post.save();
    await userTo.save();

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
      const post = await Post.findById(req.params.id);
      const userFrom = await User.findById(req.user.id).select("-password");
      const userTo = await User.findById(post.user).select("-password");
      const comment_uuid = uuidv4();

      if (post.user.toString() !== req.user.id) {
        const messageString = userFrom.name + " commented on your post";
        const newNotification = new Notification({
          user_from: req.user.id,
          user_to: post.user,
          item_id: req.params.id,
          uuid: comment_uuid,
          action: "comment",
          message: messageString
        });

        // add notification to user
        userTo.notifications.unshift({
          notification: newNotification,
          user: {
            userId: req.user.id,
            avatar: userFrom.avatar,
            name: userFrom.name,
            username: userFrom.username,
            email: userFrom.email
          },
          item_id: req.params.id,
          uuid: comment_uuid,
          action: "comment",
          message: messageString,
          viewed: false,
          opened: false
        });
        await userTo.save();
        await newNotification.save();
      }

      const newComment = {
        user: req.user.id,
        uuid: comment_uuid,
        text: req.body.commentText,
        name: userFrom.name,
        avatar: userFrom.avatar
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
    const userTo = await User.findById(post.user).select("-password");

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

    // find and remove notification for:
    //  - "x" commented on your post
    const notificationComment = await Notification.findOneAndRemove({
      item_id: req.params.id,
      action: "comment"
    });

    // - "x" liked your comment
    const notificationLike = await Notification.deleteMany({
      item_id: req.params.id,
      uuid: comment.uuid,
      action: "comment_like"
    });

    // if (notificationComment) {
    //   await notificationComment.remove();
    // }

    // if (notificationLike.length > 0) {
    //   notificationLike.map(notif => {
    //     // remove notification from user's notifications
    //     const removeNotifIndex = userTo.notifications
    //       .map(userNotif => userNotif._id)
    //       .indexOf(notif._id);
    //     userTo.notifications.splice(removeNotifIndex, 1);
    //     await notif.remove();
    //   });
    // }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await userTo.save();
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/comments/like/:postId/:commentId
// @desc     Like a comment
// @access   Private
router.put("/comment/like/:postId/:commentId", auth, async (req, res) => {
  try {
    // get the post
    const post = await Post.findById(req.params.postId);
    // get the comment
    const com = post.comments.filter(
      comment => comment._id.toString() === req.params.commentId
    )[0];
    const userFrom = await User.findById(req.user.id).select("-password");
    const userTo = await User.findById(com.user).select("-password");
    // Check if the comment has already been liked
    // filter through the likes to see if current iteration of user has liked the post already
    // this will only return something if theres a match, so if > 0 that means user has already liked the comment
    if (
      com.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      // if liked post already, find notification for like and remove it in notifications and user notifications array

      // only remove notification if comment owner is not the same as req.user.id
      if (com.user.toString() !== req.user.id) {
        // find and remove notification
        const notification = await Notification.findOne({
          user_from: req.user.id,
          user_to: com.user,
          item_id: post._id,
          uuid: com.uuid,
          action: "comment_like"
        });

        // if there is no notification that meet the requirements
        if (!notification) {
          return res.status(400).json({ msg: "Notification does not exist" });
        }

        // remove notification from user's notifications
        const removeNotifIndex = userTo.notifications
          .map(notif => notif._id)
          .indexOf(notification._id);
        userTo.notifications.splice(removeNotifIndex, 1);

        await notification.remove();
      }

      // Get remove index
      const removeIndex = com.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);

      com.likes.splice(removeIndex, 1);
    } else {
      // dont create notification for comment creator commenting on own comment
      if (com.user.toString() !== req.user.id) {
        // create new notification
        const messageString = userFrom.name + " liked your comment";
        const newNotification = new Notification({
          user_from: req.user.id,
          user_to: com.user,
          item_id: req.params.postId,
          uuid: com.uuid,
          action: "comment_like",
          message: messageString
        });

        // add notification to user
        userTo.notifications.unshift({
          notification: newNotification,
          user: {
            userId: req.user.id,
            avatar: userFrom.avatar,
            name: userFrom.name,
            username: userFrom.username,
            email: userFrom.email
          },
          item_id: req.params.comment_id,
          uuid: com.uuid,
          action: "comment_like",
          message: messageString,
          viewed: false,
          opened: false
        });
        await newNotification.save();
      }

      // unshift will add user to the front of the likes array of post
      com.likes.unshift({ user: req.user.id });
    }

    await post.save();
    await userTo.save();
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
    // get user who received notification
    const userTo = await User.findById(post.user).select("-password");
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

    // find and remove notification
    const notification = await Notification.findOne({
      item_id: post._id,
      uuid: com.uuid,
      action: "comment_like"
    });

    const notifId = notification._id;
    await notification.remove();

    // remove notification from user's notifications
    const removeNotifIndex = userTo.notifications
      .map(notif => notif._id)
      .indexOf(notifId);
    userTo.notifications.splice(removeNotifIndex, 1);

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

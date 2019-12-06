const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hobbies: {
    type: [String],
    required: true
  },
  interests: {
    type: [String],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  admins: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  posts: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }
    }
  ],
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Group = mongoose.model("group", GroupSchema);

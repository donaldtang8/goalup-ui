const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  following: [
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
  bio: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  status: {
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
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);

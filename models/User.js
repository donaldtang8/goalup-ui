const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  friend_received_requests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      name: {
        type: String
      },
      username: {
        type: String
      },
      email: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  friend_sent_requests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      name: {
        type: String
      },
      username: {
        type: String
      },
      email: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  friends: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  groups: [
    {
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "group"
      }
    }
  ],
  notifications: [
    {
      notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification"
      }
    }
  ],
  hasProfile: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", UserSchema);

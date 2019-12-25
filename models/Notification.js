const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  user_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  uuid: {
    type: String
  },
  action: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  viewed: {
    type: Boolean,
    default: false
  },
  opened: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Group = mongoose.model("notification", NotificationSchema);

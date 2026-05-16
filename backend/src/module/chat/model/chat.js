const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: String,

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const chatModel=  mongoose.model("Chat", chatSchema);
module.exports = chatModel;
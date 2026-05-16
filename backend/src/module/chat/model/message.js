const mongoose =  require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    content: {
      type: String,
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const messageModel =  mongoose.model("Message", messageSchema);
module.exports = messageModel;
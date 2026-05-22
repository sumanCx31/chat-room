const { required, date } = require("joi");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
      validate: [
        {
          validator: (value) => value.length > 0,
          message: "message cannot be empty!",
        },
      ],
    },
    // createdAt: { type: date, default: null },
  },
  { timestamps: true },
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;

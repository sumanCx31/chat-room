const chatModel = require("../model/chat.js");
const Message = require("../model/message.js");

const {
  getReceiverSocketId,
  getIO,
} = require("../../../../socket");

class ChatController {

   sendMessage = async (req, res) => {
    try {
      const { message, senderId, receiverId } = req.body;

      let conversation = await chatModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await chatModel.create({
          participants: [senderId, receiverId],
          message: [],
        });
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });

      conversation.message.push(newMessage._id);
      await conversation.save();

      // ✅ REALTIME EMIT
      const socketId = getReceiverSocketId(receiverId);
      const io = getIO();

      if (socketId && io) {
        io.to(socketId).emit("newMessage", newMessage);
      }

      return res.json({
        status: "SUCCESS",
        data: newMessage,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  getMessages = async (req, res) => {
    try {
      const receiverId = req.params._id;
      const { senderId } = req.query;

      const conversation = await chatModel
        .findOne({
          participants: { $all: [senderId, receiverId] },
        })
        .populate("message");

      return res.json({
        status: 200,
        data: conversation?.message || [],
      });

    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  };
}

module.exports = new ChatController();
const chatModel = require("../model/chat.js");
const Chat = require("../model/chat.js");
const Message = require("../model/message.js");

class ChatController {
  // Send message
  sendMessage = async (req, res) => {
    try {
      const { message, senderId,receiverId } = req.body;



      console.log(message,senderId,receiverId);
      

      if (!message || !senderId || !receiverId) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      let conversation = await chatModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      // CREATE CHAT IF NOT EXISTS
      if (!conversation) {
        conversation = await chatModel.create({
          participants: [senderId, receiverId],
          message: [],
        });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });

      conversation.message.push(newMessage._id);

      await Promise.all([conversation.save(), newMessage.save()]);

      res.status(201).json({
        status: "SUCCESS",
        message: "Message sent successfully",
        data: newMessage,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

  // Get messages of a chat
  getMessages = async (req, res) => {
    try {
      const { id: chatUser } = req.params;

      const { senderId } = "6a0889e1a09e5d310f995b5b";

      const conversation = await chatModel
        .findOne({
          participants: {
            $all: ["6a08899aa09e5d310f995b57", "6a08899aa09e5d310f995b57"],
          },
        })
        .populate("message");

      if (!conversation) {
        return res.json({
          status: 203,
          data: [],
        });
      }

      res.json({
        status: 200,
        data: conversation.message,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
}

const chatCltr = new ChatController();
module.exports = chatCltr;

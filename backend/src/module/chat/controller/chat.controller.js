const Chat = require("../model/chat.js");
const Message = require("../model/message.js");

class ChatController {
  // Create or access one-to-one chat
  accessChat = async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId)
        return res.status(400).json({ message: "UserId required" });

      let chat = await Chat.findOne({
        isGroup: false,
        participants: { $all: [req.user.id, userId] },
      }).populate("participants", "-password");

      if (chat) return res.json(chat);

      chat = await Chat.create({
        participants: [req.user.id, userId],
      });

      const fullChat = await Chat.findById(chat._id).populate(
        "participants",
        "-password"
      );

      res.json(fullChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get all chats
  getChats = async (req, res) => {
    try {
      const chats = await Chat.find({
        participants: { $in: [req.user.id] },
      })
        .populate("participants", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Send message
  sendMessage = async (req, res) => {
    try {
      const { chatId, content } = req.body;

      if (!chatId || !content)
        return res.status(400).json({ message: "Invalid data" });

      const message = await Message.create({
        sender: req.user.id,
        chat: chatId,
        content,
      });

      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      const fullMessage = await Message.findById(message._id)
        .populate("sender", "name email")
        .populate("chat");

      res.json(fullMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get messages of a chat
  getMessages = async (req, res) => {
    try {
      const messages = await Message.find({
        chat: req.params.chatId,
      })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

const chatCltr = new ChatController();
module.exports = chatCltr;
const express = require("express");
const auth = require("../../../middleware/auth.middleware.js");
const chatController= require("../controller/chat.controller.js");


const messageRouter = express.Router();

// Messages
messageRouter.post("/", auth, chatController.sendMessage);
messageRouter.get("/:chatId", auth, chatController.getMessages);

module.exports = messageRouter
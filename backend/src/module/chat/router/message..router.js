const express = require("express");
const auth = require("../../../middleware/auth.middleware.js");
const chatController= require("../controller/chat.controller.js");


const messageRouter = express.Router();

// Messages
messageRouter.post("/send", chatController.sendMessage);
messageRouter.get("/get/:_id",  chatController.getMessages);

module.exports = messageRouter
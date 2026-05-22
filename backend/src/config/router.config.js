const authRouter = require("../module/auth/auth.router");
const chatRouter = require("../module/chat/router/chat.router");
const messageRouter = require("../module/chat/router/message..router");
const router = require("express").Router();

router.get("", (req ,res)=> {
  res.end("hello world!!");
});

router.use("/auth",authRouter);
// router.use('/chat',chatRouter);
router.use('/message',messageRouter);

module.exports = router;

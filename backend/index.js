const http = require("http");
const { Server } = require("socket.io"); 
const app = require("./src/config/express.config");

const server = http.createServer(app);

const PORT = 9001 || 9006;

// SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // USER ONLINE
  socket.on("setup", (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // JOIN CHAT ROOM
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });

  // SEND MESSAGE 
  socket.on("send-message", (message) => {
    const chat = message.chat;

    if (!chat?.participants) return;

    chat.participants.forEach((user) => {
      if (user._id === message.sender._id) return;

      io.to(user._id).emit("receive-message", message);
    });
  });

  // TYPING
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  socket.on("stop-typing", (chatId) => {
    socket.to(chatId).emit("stop-typing");
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

// START SERVER
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`Press CTRL + C to stop the server`);
});
const { Server } = require("socket.io");

const users = new Map();
let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId;

    if (!userId) return;

    users.set(userId, socket.id);

    console.log("CONNECTED:", userId, socket.id);

    io.emit("getonline", Array.from(users.keys()));

    socket.on("disconnect", () => {
      if (users.get(userId) === socket.id) {
        users.delete(userId);
      }

      io.emit("getonline", Array.from(users.keys()));
    });
  });
};

const getReceiverSocketId = (receiverId) => {
  return users.get(receiverId);
};

const getIO = () => io;

module.exports = {
  initSocket,
  getReceiverSocketId,
  getIO,
};
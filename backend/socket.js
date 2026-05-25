const { Server } = require("socket.io");

let io;
const users = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("New Client Connected:", socket.id, "User:", userId);

    if (!userId) return;

    if (!users.has(userId)) {
      users.set(userId, new Set());
    }

    users.get(userId).add(socket.id);

    io.emit("getonline", Array.from(users.keys()));
    console.log("Client disconnected:", socket.id);

    socket.on("disconnect", () => {
      const set = users.get(userId);

      if (set) {
        set.delete(socket.id);
        if (set.size === 0) users.delete(userId);
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
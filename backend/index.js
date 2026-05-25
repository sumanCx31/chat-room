const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/config/express.config");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


const getReceiverSocketId = (receiverId)=>{
  return users[receiverId];
}

const users = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("New Client Connected:", socket.id, "User:", userId);

  if (!userId) return;

  if (!users.has(userId)) {
    users.set(userId, new Set());
  }

  users.get(userId).add(socket.id);
  io.emit("getonline", Array.from(users.keys()));

  socket.on("disconnect", () => {
    const set = users.get(userId);

    if (set) {
      set.delete(socket.id);

      if (set.size === 0) {
        users.delete(userId);
      }
    }

    io.emit("getonline", Array.from(users.keys()));

    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 9001;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});



module.exports ={ getReceiverSocketId,io };
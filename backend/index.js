const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/config/express.config");
const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 9001;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`Press CTRL + C to stop the server`);
});
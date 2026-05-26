const http = require("http");
const app = require("./src/config/express.config");
const { initSocket } = require("./socket");

const server = http.createServer(app);

// IMPORTANT
initSocket(server);

server.listen(9001, () => {
  console.log("Server running on 9001");
});
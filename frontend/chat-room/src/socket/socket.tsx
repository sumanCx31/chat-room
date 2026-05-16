import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_APP_SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;
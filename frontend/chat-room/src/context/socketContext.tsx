import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./auth.context";

interface SocketContextType {
  socket: any;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: any) => {
  const { loggedInUser } = useAuth();
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

useEffect(() => {
  if (!loggedInUser?._id) return;

  const newSocket = io("http://localhost:9001", {
    auth: {
      userId: loggedInUser._id,
    },
  });

  setSocket(newSocket);

  newSocket.on("getonline", (users: string[]) => {
    setOnlineUsers(users);
  });

  return () => {
    newSocket.disconnect(); // ✅ no return value
  };
}, [loggedInUser?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
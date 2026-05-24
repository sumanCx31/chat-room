import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./auth.context";

type SocketContextType = {
  socket: Socket | null;
  onlineUsers: string[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

type Props = {
  children: any;
};

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    if (!loggedInUser?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:9001", {
      query: {
        userId: loggedInUser._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getonline", (users: string[]) => {
      setOnlineUsers(users);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [loggedInUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
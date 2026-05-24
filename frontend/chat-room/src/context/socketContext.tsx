import {
  createContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./auth.context";

type SocketContextType = {
  socket: Socket | null;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});

type Props = {
  children:any;
};

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    if (!loggedInUser?._id) return;

    const newSocket = io("http://localhost:9001", {
      query: {
        userId: loggedInUser._id,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [loggedInUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

import { useEffect } from "react";
import useConversation from "./useConversation";
import { useSocketContext } from "./socketContext";
import sound from "../assets/notification.mp3"

function useGetSocketMessage() {
  const { socket } = useSocketContext();
  const { messages, setMessages }:any = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handler = (newMessage: any) => {
      setMessages([...messages, newMessage]);
    };

    socket.on("newMessage", handler);
    const notification = new Audio(sound);
    notification.play();

    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, messages, setMessages]);
}

export default useGetSocketMessage;
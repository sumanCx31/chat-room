import { useEffect, useRef } from "react";
import useConversation from "./useConversation";
import { useSocketContext } from "./socketContext";
import notification from "../assets/notification.mp3";

function useGetSocketMessage() {
  const { socket }: any = useSocketContext();
  const { setMessages, selectedConversation }: any = useConversation();

  const selectedRef = useRef(selectedConversation);

  useEffect(() => {
    selectedRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!socket) return;

    const audio = new Audio(notification); 

    const handler = (msg: any) => {
      const active = selectedRef.current;
      if (!active) return;

      const isActiveChat =
        msg.senderId === active._id ||
        msg.receiverId === active._id;

      if (isActiveChat) {
        setMessages((prev: any) => [...prev, msg]);

        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.log("Audio blocked:", err);
        });
      }
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, setMessages]);
}

export default useGetSocketMessage;
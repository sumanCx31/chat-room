import { useEffect, useRef } from "react";
import useConversation from "./useConversation";
import { useSocketContext } from "./socketContext";

function useGetSocketMessage() {
  const { socket }:any = useSocketContext();
  const { setMessages, selectedConversation }:any = useConversation();

  const selectedRef = useRef(selectedConversation);

  useEffect(() => {
    selectedRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: any) => {
      const active = selectedRef.current;
      if (!active) return;

      if (
        msg.senderId === active._id ||
        msg.receiverId === active._id
      ) {
        setMessages((prev: any) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, [socket, setMessages]);
}

export default useGetSocketMessage;
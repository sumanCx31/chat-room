import { useEffect, useState } from "react";
import useConversation from "./useConversation";
import authSvc from "../services/Auth.service";

function useGetMessage() {
  const [loading, setLoading] = useState(false);

  const senderId = localStorage.getItem("senderId");

  const {
    messages,
    setMessages,
    selectedConversation,
  }: any = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id || !senderId) return;

      try {
        setLoading(true);

        const response = await authSvc.getRequest(
          `/message/get/${selectedConversation._id}?senderId=${senderId}`
        );

        const data =
          response?.data?.data ||
          response?.data ||
          [];

        setMessages(data);
      } catch (error) {
        console.log("Error in useGetMessage:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, senderId]);

  return {
    messages,
    loading,
  };
}

export default useGetMessage;
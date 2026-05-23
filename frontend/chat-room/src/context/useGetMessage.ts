import { useEffect, useState } from "react";
import useConversation from "./useConversation";
import authSvc from "../services/Auth.service";

function useGetMessage() {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedConversation }: any =
    useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      try {
        setLoading(true);

        const response = await authSvc.getRequest(
          `/message/get/${selectedConversation._id}`,
        );

        setMessages(response?.data?.data || []);
      } catch (error) {
        console.log("Error in useGetMessage:", error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation]);

  return {
    messages,
    loading,
  };
}

export default useGetMessage;

import axios from "axios";

const API = "http://localhost:9001/api/v1";

export const getChats = async (token: string) => {
  const res = await axios.get(`${API}/chat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getMessages = async (chatId: string, token: string) => {
  const res = await axios.get(`${API}/message/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const sendMessageApi = async (
  chatId: string,
  content: string,
  token: string
) => {
  const res = await axios.post(
    `${API}/message`,
    { chatId, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
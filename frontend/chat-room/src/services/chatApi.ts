const BASE_URL = "http://localhost:9001/api/v1";

export const getChats = async (token: string) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json.data;
};

export const getMessages = async (
  chatId: string,
  token: string
) => {
  const res = await fetch(
    `${BASE_URL}/chat/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await res.json();

  return json.data;
};

export const sendMessageApi = async (
  chatId: string,
  content: string,
  token: string
) => {
  const res = await fetch(
    `${BASE_URL}/chat/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatId,
        content,
      }),
    }
  );

  const json = await res.json();

  return json.data;
};

export const accessChat = async (
  userId: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
    }),
  });

  const json = await res.json();

  return json.data;
};
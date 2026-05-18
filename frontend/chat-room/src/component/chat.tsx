import { useEffect, useState } from "react";
import "../assets/style/index.css";

import { socket } from "../socket/socket";

import {
  getChats,
  getMessages,
  sendMessageApi,
  accessChat,
} from "../api/chatApi";

type Message = {
  _id?: string;
  chat: any;
  sender: any;
  content: string;
};

type ChatType = {
  _id: string;
  participants: any[];
  latestMessage?: any;
};

type UserType = {
  _id: string;
  name: string;
  email: string;
};

const Chat = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] =
    useState<ChatType | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState("");

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchUsers();
    fetchChats();

    socket.emit("setup", user._id);

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:9001/api/v1/auth/users",
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      const json = await res.json();

      setUsers(json?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChats = async () => {
    try {
      const data = await getChats(token);

      setChats(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join-chat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
      if (message.chat._id === selectedChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [selectedChat]);

  const openChat = async (chat: ChatType) => {
    setSelectedChat(chat);

    const msgs = await getMessages(chat._id, token);

    setMessages(msgs || []);
  };

  const handleUserClick = async (u: UserType) => {
    try {
      let existingChat:any = chats.find((chat) =>
        chat.participants.some((p) => p._id === u._id)
      );

      if (!existingChat) {
        existingChat = await accessChat(u._id, token);

        setChats((prev) => [...prev, existingChat!]);
      }

      openChat(existingChat);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const savedMsg = await sendMessageApi(
        selectedChat._id,
        newMessage,
        token
      );

      setMessages((prev) => [...prev, savedMsg]);

      socket.emit("send-message", savedMsg);

      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-950 text-white h-screen flex">

      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">

        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-bold">Chats</h1>
        </div>

        <div className="flex-1 overflow-y-auto">

          {users
            .filter((u) => u._id !== user._id)
            .map((u) => {
              const isOnline = onlineUsers.includes(u._id);

              return (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u)}
                  className="p-3 border-b border-slate-800 hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <h2 className="font-semibold">
                        {u.name}
                      </h2>

                      <p
                        className={`text-xs ${
                          isOnline
                            ? "text-green-400"
                            : "text-slate-500"
                        }`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}

        </div>

      </aside>

      <main className="flex-1 flex flex-col">

        <header className="h-16 border-b border-slate-800 flex items-center px-6">

          <h2 className="font-semibold">
            {selectedChat
              ? selectedChat.participants.find(
                  (p) => p._id !== user._id
                )?.name
              : "Select User"}
          </h2>

        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.map((msg, i) => {
            const isMe = msg.sender?._id === user._id;

            return (
              <div
                key={i}
                className={`flex ${
                  isMe ? "justify-end" : ""
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md ${
                    isMe
                      ? "bg-indigo-600"
                      : "bg-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

        </div>

        {selectedChat && (
          <div className="p-4 border-t border-slate-800">

            <div className="flex gap-3">

              <input
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
                placeholder="Type message..."
                className="flex-1 bg-slate-900 px-4 rounded-xl outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-indigo-600 px-5 rounded-xl"
              >
                Send
              </button>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Chat;
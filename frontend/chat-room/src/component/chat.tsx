import { useEffect, useState } from "react";
import "../assets/style/index.css";
import { socket } from "../socket/socket";

import {
  getChats,
  getMessages,
  sendMessageApi,
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
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchUsers();
    fetchChats();
  }, []);

  // ✅ FIXED USERS FETCH (IMPORTANT)
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:9007/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // JOIN CHAT ROOM
  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join-chat", selectedChat._id);
    }
  }, [selectedChat]);

  // RECEIVE MESSAGE
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

  // OPEN CHAT
  const openChat = async (chat: ChatType) => {
    setSelectedChat(chat);

    const msgs = await getMessages(chat._id, token);
    setMessages(msgs || []);
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const savedMsg = await sendMessageApi(
      selectedChat._id,
      newMessage,
      token
    );

    setMessages((prev) => [...prev, savedMsg]);

    socket.emit("send-message", savedMsg);

    setNewMessage("");
  };

  return (
    <div className="bg-slate-950 text-slate-100 h-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">

        {/* USERS */}
        <div className="flex-1 overflow-y-auto">

          {users.map((u) => {
            const existingChat = chats.find((chat) =>
              chat.participants.some((p) => p._id === u._id)
            );

            return (
              <div
                key={u._id}
                onClick={() => existingChat && openChat(existingChat)}
                className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  {u.name?.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">
                    {u.name}
                  </h3>

                  <p className="text-xs text-slate-400 truncate">
                    {existingChat?.latestMessage?.content || u.email}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6">
          <h2 className="text-sm font-semibold">
            {selectedChat
              ? selectedChat.participants.find(
                  (p) => p._id !== user._id
                )?.name
              : "Select Chat"}
          </h2>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">

          {messages.map((msg, i) => {
            const isMe = msg.sender?._id === user._id;

            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : ""}`}
              >
                <div
                  className={`p-3 rounded-2xl text-sm max-w-lg ${
                    isMe ? "bg-indigo-600" : "bg-slate-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-900 rounded-2xl p-2 px-4">

            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-indigo-600 w-9 h-9 rounded-xl"
            >
              ➤
            </button>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Chat;
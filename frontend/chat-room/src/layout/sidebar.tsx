import { useEffect, useState } from "react";
import "../assets/style/index.css";
import { socket } from "../socket/socket";

import {
  getChats,
  sendMessageApi,
} from "../api/chatApi";

import {
  getMessages,
  accessChat,
} from "../api/chatApi";

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

const sidebar = async() => {
  const [users, setUsers] = useState<UserType[]>([]);
    const [chats, setChats] = useState<ChatType[]>([]);
    const [selectedChat, setSelectedChat] =
      useState<ChatType | null>(null);
  
    const [messages, setMessages] = useState<any[]>([]);
  
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
          "http://localhost:9001/api/v1/auth/users"
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
      socket.on("receive-message", (message: any) => {
        if (message.chat?._id === selectedChat?._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
  
      return () => {
        socket.off("receive-message");
      };
    }, [selectedChat]);
  
    const handleUserClick = async (u: UserType) => {
      try {
        let existingChat: any = chats.find((chat) =>
          chat.participants.some((p) => p._id === u._id)
        );
  
        if (!existingChat) {
          const newChat = await accessChat(u._id, token);
  
          existingChat = newChat;
  
          setChats((prev) => [...prev, newChat]);
        }
  
        setSelectedChat(existingChat);
  
        socket.emit("join-chat", existingChat._id);
  
        const msgs = await getMessages(
          existingChat._id,
          token
        );
  
        setMessages(msgs || []);
      } catch (err) {
        console.log(err);
      }
    };
  
  return (
    <>
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-bold">Chats</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users
            .filter((u) => u._id !== user._id)
            .map((u) => {
              const isOnline = onlineUsers.includes(u._id);

              const existingChat = chats.find((chat) =>
                chat.participants.some((p) => p._id === u._id),
              );

              const isSelected = selectedChat?._id === existingChat?._id;

              return (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u)}
                  className={`p-3 border-b border-slate-800 cursor-pointer transition ${
                    isSelected ? "bg-slate-800" : "hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          isOnline ? "bg-green-500" : "bg-slate-500"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold text-sm">{u.name}</h2>

                      <p className="text-xs text-slate-400 truncate">
                        {existingChat?.latestMessage?.content ||
                          "Start conversation"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>
    </>
  );
}

export default sidebar;

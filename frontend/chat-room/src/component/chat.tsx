import { useEffect, useState } from "react";
import Sidebar from "../layout/sidebar";
import "./../assets/style/index.css";
import Message from "./message";
import useGetMessage from "../context/useGetMessage.ts";
import useConversation from "../context/useConversation.ts";

type UserType = {
  _id: string;
  name: string;
  email: string;
};

const Chat = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  const { selectedConversation }: any = useConversation();

  const { messages, loading } = useGetMessage();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:9001/api/v1/auth/users"
      );

      const data = await res.json();

      setUsers(data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex bg-slate-950 text-white overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar users={users} />

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col h-screen">

        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900 shrink-0">

          {selectedConversation ? (
            <div>
              <h2 className="font-semibold text-lg">
                {selectedConversation.name}
              </h2>

              <p className="text-xs text-slate-400">
                {selectedConversation.email}
              </p>
            </div>
          ) : (
            <h2 className="text-slate-400 text-sm">
              Select User
            </h2>
          )}

        </header>

        {/* BODY */}
        {selectedConversation ? (
          <>
            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {loading ? (
                <p>Loading...</p>
              ) : (
                messages?.map((msg: any) => (
                  <Message key={msg._id} message={msg} />
                ))
              )}

            </div>

            {/* INPUT */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">

              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Type message..."
                  className="input input-bordered flex-1 bg-slate-800 border-slate-700"
                />

                <button className="btn btn-primary">
                  Send
                </button>

              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">

            <div className="text-center">

              <h1 className="text-2xl font-bold text-slate-300">
                Welcome to Chat
              </h1>

              <p className="text-slate-500 mt-2">
                Select a user from sidebar
              </p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Chat;
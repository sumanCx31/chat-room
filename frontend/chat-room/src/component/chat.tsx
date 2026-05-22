import { useEffect, useState } from "react";
import Sidebar from "../layout/sidebar";

type UserType = {
  _id: string;
  name: string;
  email: string;
};

const Chat = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<UserType | null>(null);

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
    <div className="h-screen flex bg-slate-950 text-white">

      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      <main className="flex-1 flex flex-col">

        <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900">

          {selectedUser ? (
            <div>
              <h2 className="font-semibold text-lg">
                {selectedUser.name}
              </h2>

              <p className="text-xs text-slate-400">
                {selectedUser.email}
              </p>
            </div>
          ) : (
            <h2 className="text-slate-400 text-sm">
              Select User
            </h2>
          )}

        </header>

        <div className="flex-1 flex items-center justify-center">

          {selectedUser ? (
            <div className="text-center">

              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {selectedUser.name
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <h1 className="text-2xl font-bold">
                {selectedUser.name}
              </h1>

              <p className="text-slate-400 mt-2">
                {selectedUser.email}
              </p>

            </div>
          ) : (
            <div className="text-center">

              <h1 className="text-2xl font-bold text-slate-300">
                Welcome to Chat
              </h1>

              <p className="text-slate-500 mt-2">
                Select a user from sidebar
              </p>

            </div>
          )}

        </div>

      </main>
    </div>
  );
};

export default Chat;
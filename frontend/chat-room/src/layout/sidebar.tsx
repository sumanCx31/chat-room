type UserType = {
  _id: string;
  name: string;
  email: string;
};

type SidebarProps = {
  users: UserType[];
  selectedUser: UserType | null;
  onSelectUser: (user: UserType) => void;
};

const Sidebar = ({
  users,
  selectedUser,
  onSelectUser,
}: SidebarProps) => {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">

      <div className="h-16 border-b border-slate-800 flex items-center px-6">
        <h1 className="text-xl font-bold">
          Chats
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">

        {users.map((user) => {
          const isSelected = selectedUser?._id === user._id;

          return (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`p-4 border-b border-slate-800 cursor-pointer transition ${
                isSelected
                  ? "bg-slate-800"
                  : "hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                  {user.name
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="font-semibold text-sm">
                    {user.name}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </aside>
  );
};

export default Sidebar;
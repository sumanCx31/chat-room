import { useSocketContext } from "../context/socketContext";
import useConversation from "../context/useConversation";

type UserType = {
  _id: string;
  name: string;
  email: string;
  image: {
    publicId: string;
    secureUrl: string;
    optimizedUrl: string;
  };
};

type SidebarProps = {
  users: UserType[];
};

const Sidebar = ({ users }: SidebarProps) => {
  const { selectedConversation, setSelectedConversation }: any =
    useConversation();

  const { onlineUsers }: any = useSocketContext();

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="h-16 border-b border-slate-800 flex items-center px-6">
        <h1 className="text-xl font-bold">Chats</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => {
          const isSelected = selectedConversation?._id === user._id;

          const isOnline = onlineUsers?.includes(String(user._id));
          console.log({
            user: user._id,
            onlineUsers,
            isOnline,
          });

          return (
            <div
              key={user._id}
              onClick={() => setSelectedConversation(user)}
              className={`p-4 border-b border-slate-800 cursor-pointer transition ${
                isSelected ? "bg-slate-800" : "hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* AVATAR */}
                <div
                  className={`avatar size-15 ${
                    isOnline ? "avatar-online" : ""
                  }`}
                >
                  <div className="w-24 rounded-full">
                    <img
                      src={
                        user.image?.secureUrl ||
                        "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                      }
                      alt={user.name}
                    />
                  </div>
                </div>

                {/* USER INFO */}
                <div>
                  <h2 className="font-semibold text-sm">{user.name}</h2>

                  <p className="text-xs text-slate-400">{user.email}</p>
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

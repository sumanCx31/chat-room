import { useEffect } from "react";
import { socket } from "./socket/socket";

const App = () => {
  useEffect(() => {
    socket.connect();

    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      socket.emit("setup", parsedUser._id);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>App</div>;
};

export default App;
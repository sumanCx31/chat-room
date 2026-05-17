import NotFound from "../component/not-found";
import ChatLogin from "../component/loginForm";
import ChatRegister from "../component/registerForm";
import { createBrowserRouter, RouterProvider } from "react-router";
import Chat from "../component/chat";



const routerConfig = createBrowserRouter([
    { path: "/", Component: ChatLogin },
    { path: "register", Component: ChatRegister },
    {path:"/chat",Component:Chat},
  {
    path: "*",
    Component: NotFound,
  },
]);

const RouterConfig = () => {
  return (
    <>
        <RouterProvider router={routerConfig} />
    </>
  );
};
export default RouterConfig;

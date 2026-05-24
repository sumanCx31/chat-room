import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterConfig from "./config/router.config";
import { SocketProvider } from "./context/socketContext";
import { AuthProvider } from "./context/auth.context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RouterConfig />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
);

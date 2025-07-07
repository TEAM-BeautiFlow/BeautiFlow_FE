import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";
import TemplateList from "./pages/TemplateList";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatList />
    {/* <Chat /> */}
    {/* <TemplateList /> */}
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";
import TemplateList from "./pages/TemplateList";
import ChatProfile from "./pages/User/Chat/ChatProfile";
import ShopForm from "./pages/ShopForm";
import ShopAnnouncement from "./pages/ShopAnnouncement";
import ReservationListPage from "./pages/User/Reservation/ReservationListPage";
import { BrowserRouter, Router } from "react-router-dom";
import App from "./App";
import UserChatPage from "./pages/User/Chat/UserChatPage";
import ManagerChatPage from "./pages/Manager/Chat/ManagerChatPage";
// import ManagerChatPage from "./pages/Manager/Chat/ManagerChatPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <BrowserRouter> */}
    {/* <ChatList /> */}
    {/* <Chat /> */}
    {/* <ManagerChatPage /> */}
    {/* <TemplateList /> */}
    {/* <ManagerChatPage /> */}
    {/* <ChatProfile /> */}
    {/* <ShopForm /> */}
    {/* <ShopAnnouncement /> */}
    <App />
    {/* </BrowserRouter> */}
  </StrictMode>,
);

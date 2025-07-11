import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";
import TemplateList from "./pages/TemplateList";
import ReservationList from "./pages/ReservaitonList";
import ReservationDetail from "./pages/ReservationDetail";
import ReservationList3 from "./pages/ReservationList3";
import ChatProfile from "./pages/ChatProfile";
import ShopForm from "./pages/ShopForm";
import ShopAnnouncement from "./pages/ShopAnnouncement";
// import ManagerChatPage from "./pages/Manager/Chat/ManagerChatPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <ChatList /> */}
    {/* <Chat /> */}
    {/* <TemplateList /> */}
    {/* <ManagerChatPage /> */}
    {/* <ReservationList /> */}
    {/* <ReservationList3 /> */}
    <ReservationDetail />
    {/* <ChatProfile /> */}
    {/* <ShopForm /> */}
    {/* <ShopAnnouncement /> */}
  </StrictMode>,
);

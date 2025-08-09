import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReservationListPage from "./pages/User/Reservation/ReservationListPage";
import ReservationDetailPage from "./pages/User/Reservation/ReservationDetailPage";
import Layout from "./layout/Layout";
import ReservationWrapper from "./layout/ReservationWrapper";
import UserChatListPage from "./pages/User/Chat/UserChatListPage";
import ManagerChatListPage from "./pages/Manager/Chat/ManagerChatListPage";
import TemplateListPage from "./pages/Manager/Chat/TemplateListPage";
import ManagerChatPage from "./pages/Manager/Chat/ManagerChatPage";
import GroupChatPage from "./pages/Manager/Chat/GroupChatPage";
import TemplateFormPage from "./pages/Manager/Chat/TemplateFormPage";
import UserChatPage from "./pages/User/Chat/UserChatPage";
import ChatProfile from "./pages/User/Chat/ChatProfile";
import ChatProfilePage from "./pages/Manager/Chat/ChatProfilePage";
import ClientListPage from "./pages/Manager/Client/ClientListPage";
import ClientPage from "./pages/Manager/Client/ClientPage";
import ModifyPage from "./pages/Manager/Client/ModifyPage";
import GroupSet from "./pages/Manager/Chat/GroupSet";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import KakaoCallbackPage from "./pages/Login/KakaoCallbackPage";
import PostLoginRedirect from "./pages/Auth/PostLoginRedirect";

const router = createBrowserRouter([
  // 로그인/회원가입은 레이아웃 바깥에서 바로 매칭
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/kakao/callback", element: <KakaoCallbackPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <PostLoginRedirect /> },
      //     {
      //     index: true,
      //     element: <HomePage />
      //   },
      {
        path: "reservation",
        element: <ReservationWrapper />,
        children: [
          { index: true, element: <ReservationListPage /> },
          { path: ":reservationId", element: <ReservationDetailPage /> },
        ],
      },
      {
        path: "user/chat/rooms",
        element: <UserChatListPage />,
      },

      {
        path: "user/chat/rooms/:roomId",
        element: <UserChatPage />,
      },

      {
        path: "chat/rooms",
        element: <ManagerChatListPage />,
      },
      { path: "chat/rooms/groupset", element: <GroupSet /> },
      {
        path: "chat/rooms/:roomId",
        element: <ManagerChatPage />,
      },
      {
        path: "chat/rooms/groupchat",
        element: <GroupChatPage />,
      },
      {
        path: "chat/rooms/profile/:opponentId",
        element: <ChatProfile />,
      },
      {
        path: "chat/rooms/profile",
        element: <ChatProfilePage />,
      },
      {
        path: "templates",
        element: <TemplateListPage />,
      },
      {
        path: "templatesform",
        element: (
          <TemplateFormPage
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      },
      { path: "client", element: <ClientListPage /> },
      { path: "client/page", element: <ClientPage /> },
      { path: "client/page/modify", element: <ModifyPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

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
import OwnerEditAnnouncementPage from "./pages/Manager/OwnerEditAnnouncementPage";
import OwnerBusinessHoursPage from "./pages/Manager/OwnerBusinessHoursPage";
import OwnerVerificationPage from "./pages/Manager/OwnerVerificationPage";
import OwnerTreatmentsPage from "./pages/Manager/OwnerTreatmentsPage";
import OwnerStoreInfoPage from "./pages/Manager/OwnerStoreInfoPage";
import TreatmentOptionsPage from "./pages/Consumer/TreatmentOptionsPage";
import BookingPage from "./pages/Consumer/BookingPage";
import ArtDetailPage from "./pages/Consumer/ArtDetailPage";
import KakaoCallbackPage from "./pages/Login/KakaoCallbackPage";
import PostLoginRedirect from "./pages/Auth/PostLoginRedirect";
import AppointmentBooking from "./pages/Consumer/AppointmentBooking";
import TreatmentBookingPage from "./pages/Consumer/TreatmentBookingPage";
import ReservationCheck from "./pages/Consumer/ReservationCheck";

// 'Reservation'과 'ReservationCheck' 컴포넌트는 현재 사용되지 않아 주석 처리했습니다.
// 필요하시면 주석을 해제하고 사용하세요.
// import Reservation from "./pages/Consumer/Reservation";
// import ReservationCheck from "./pages/Consumer/ReservationCheck";

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
        path: "tteesstt",
        element: <TreatmentBookingPage />,
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
      
      // --- 소비자 예약 플로우 라우트 ---
      // {
      //   path: "reservation_consumer", // 시작점으로 보이나 현재 흐름에서는 사용되지 않는 것 같아 주석 처리
      //   element: <Reservation />,
      // },
      {
        path: "art-detail/:shopId/:treatmentId",
        element: <ArtDetailPage />,
      },
      {
        path: "options/:shopId/:treatmentId",
        element: <TreatmentOptionsPage />,
      },
      {
        path: "booking/:shopId/:treatmentId",
        element: <BookingPage />,
      },
      // ⚠️ 수정: 새 라우트 추가
      // BookingPage 다음 단계인 최종 예약 정보 확인 페이지
      {
        path: "appointment-booking/:shopId/:treatmentId",
        element: <AppointmentBooking />,
      },
      {
        path: "booking-confirmation/:shopId/:treatmentId",
        element: <TreatmentBookingPage />,
      },
      {
        path: "reservation-check/:shopId/:treatmentId",
        element: <ReservationCheck />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
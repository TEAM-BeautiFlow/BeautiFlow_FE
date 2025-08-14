import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
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
import Mypage from "./pages/User/Mypage/Mypage";
import EditStyle from "./pages/User/Mypage/EditStyle";
import ManagerMypage from "./pages/Manager/Mypage/Mypage";
import ManagerMypageModify from "./pages/Manager/Mypage/MypageModify";
import ManagerMypageEdit from "./pages/Manager/Mypage/MypageEdit";
import OnboardFirst from "./pages/Manager/Onboard/components/OnboardFirst";
import OnboardJoin from "./pages/Manager/Onboard/components/OnboardJoin";
import OnboardShopRegister from "./pages/Manager/Onboard/components/OnboardShopRegister";
import OnboardShopFin from "./pages/Manager/Onboard/components/OnboardShopFin";
import OnboardJoinFin from "./pages/Manager/Onboard/components/OnboardJoinFin";
import HomePage from "./pages/Manager/Home/HomePage";
import AboutReservationPage from "./pages/Manager/Home/AboutReservationPage";

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
        path: "reservations",
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
        path: "chat/rooms/profile/:customerId",
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
          // onClose={function (): void {
          //   throw new Error("Function not implemented.");
          // }}
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
      { path: "mangedCustomer", element: <ClientListPage /> },
      { path: "mangedCustomer/:customerId", element: <ClientPage /> },
      { path: "mangedCustomer/:customerId/modify", element: <ModifyPage /> },
      { path: "client/mypage", element: <Mypage /> },
      { path: "client/mypage/edit", element: <ManagerMypageEdit /> },
      { path: "client/mypage/style", element: <EditStyle /> },
      { path: "manager/mypage", element: <ManagerMypage /> },
      { path: "manager/mypage/modify", element: <ManagerMypageModify /> },
      { path: "manager/mypage/edit", element: <ManagerMypageEdit /> },
      { path: "manager/onboard", element: <OnboardFirst /> },
      { path: "manager/onboard/join", element: <OnboardJoin /> },
      { path: "manager/onboard/join/fin", element: <OnboardJoinFin /> },
      { path: "manager/onboard/shop", element: <OnboardShopRegister /> },
      { path: "manager/onboard/shop/fin", element: <OnboardShopFin /> },
      { path: "manager/home", element: <HomePage /> },
      {
        path: "manager/reservations/:reservationId",
        element: <AboutReservationPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0,
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  useEffect(() => {
    // 새로고침 직후에도 토큰을 스토어로 동기화
    try {
      useAuthStore.getState().hydrateFromStorage();
    } catch {}
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
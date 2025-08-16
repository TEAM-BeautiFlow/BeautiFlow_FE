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
import OwnerBusinessHoursPage from "./pages/Manager/OwnerBusinessHoursPage";
import OwnerVerificationPage from "./pages/Manager/OwnerVerificationPage";
import OwnerStoreInfoPage from "./pages/Manager/OwnerStoreInfoPage";
import OwnerBusinessRegistrationPage from "./pages/Manager/OwnerBusinessRegistrationPage";
import OwnerStoreIntroPage from "./pages/Manager/OwnerStoreIntroPage";
import OwnerSalesPage from "./pages/Manager/OwnerSalesPage";
import TreatmentOptionsPage from "./pages/Consumer/TreatmentOptionsPage";
import BookingPage from "./pages/Consumer/BookingPage";
import ArtDetailPage from "./pages/Consumer/ArtDetailPage";
import KakaoCallbackPage from "./pages/Login/KakaoCallbackPage";
// import PostLoginRedirect from "./pages/Auth/PostLoginRedirect";
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

import TermsPage from "./pages/Terms/TermsPage";
import PrivacyPage from "./pages/Privacy/PrivacyPage";
import MainPage from "./pages/MainPage";
import Reservation from "./pages/Consumer/Reservation";
import OwnerEditTreatmentPage from "./pages/Manager/OwnerEditTreatmentPage";
import OwnerEditAnnouncementPage from "./pages/Manager/OwnerEditAnnouncementPage";
import OwnerCreateAnnouncementPage from "./pages/Manager/OwnerCreateAnnouncementPage";
import OwnerCreateTreatmentPage from "./pages/Manager/OwnerCreateTreatmentPage";

const router = createBrowserRouter([
  // 레이아웃 바깥 경로 (로그인, 회원가입 등)
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/kakao/callback", element: <KakaoCallbackPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },

      // --- ✅ 소비자 예약 플로우 라우트 (7단계 순차 연결) ---
      // 1단계: 매장 메인 페이지 (시술 목록)
      { path: "user/store/:shopId", element: <Reservation /> },
      // 2단계: 시술 상세 정보
      {
        path: "user/store/art-detail/:shopId/:treatmentId",
        element: <ArtDetailPage />,
      },
      // 3단계: 시술 옵션 선택
      {
        path: "user/store/treatment-options/:shopId/:treatmentId",
        element: <TreatmentOptionsPage />,
      },
      // 4단계: 날짜, 시간, 디자이너 선택
      {
        path: "user/store/booking/:shopId/:treatmentId",
        element: <BookingPage />,
      },
      // 5단계: 요청사항 입력 및 최종 예약 처리
      {
        path: "user/store/appointment-booking/:shopId/:treatmentId",
        element: <AppointmentBooking />,
      },
      // 6단계: 예약 정보 확인 및 약관 동의
      {
        path: "user/store/treatment-booking/:shopId",
        element: <TreatmentBookingPage />,
      },
      // 7단계: 최종 결제 정보 확인 (예약금)
      {
        path: "user/store/reservation-check/:shopId",
        element: <ReservationCheck />,
      },

      // --- 유저(소비자) 기능 라우트 ---
      {
        path: "reservations",
        element: <ReservationWrapper />,
        children: [
          { index: true, element: <ReservationListPage /> },
          { path: ":reservationId", element: <ReservationDetailPage /> },
        ],
      },
      { path: "user/chat/rooms", element: <UserChatListPage /> },
      { path: "user/chat/rooms/:roomId", element: <UserChatPage /> },
      { path: "user/chat/rooms/profile/:designerId", element: <ChatProfile /> },
      { path: "client/mypage", element: <Mypage /> },
      { path: "client/mypage/edit", element: <ManagerMypageEdit /> },
      { path: "client/mypage/style", element: <EditStyle /> },

      // --- 사장님(Manager) 기능 라우트 ---
      { path: "manager/home", element: <HomePage /> },
      { path: "chat/rooms", element: <ManagerChatListPage /> },
      { path: "chat/rooms/groupset", element: <GroupSet /> },
      { path: "chat/rooms/:roomId", element: <ManagerChatPage /> },
      { path: "chat/rooms/groupchat", element: <GroupChatPage /> },
      { path: "chat/rooms/profile/:customerId", element: <ChatProfilePage /> },
      { path: "templates", element: <TemplateListPage /> },
      { path: "templatesform", element: <TemplateFormPage /> },
      { path: "mangedCustomer", element: <ClientListPage /> },
      { path: "mangedCustomer/:customerId", element: <ClientPage /> },
      { path: "mangedCustomer/:customerId/modify", element: <ModifyPage /> },
      { path: "manager/mypage", element: <ManagerMypage /> },
      { path: "manager/mypage/modify", element: <ManagerMypageModify /> },
      { path: "manager/mypage/edit", element: <ManagerMypageEdit /> },
      { path: "manager/onboard", element: <OnboardFirst /> },
      { path: "manager/onboard/join", element: <OnboardJoin /> },
      { path: "manager/onboard/join/fin", element: <OnboardJoinFin /> },
      { path: "manager/onboard/shop", element: <OnboardShopRegister /> },
      { path: "manager/onboard/shop/fin", element: <OnboardShopFin /> },
      {
        path: "manager/reservations/:reservationId",
        element: <ReservationDetailPage />,
      },
      {
        path: "owner/verification/:shopId",
        element: <OwnerVerificationPage />,
      },
      {
        path: "owner/business-registration/:shopId",
        element: <OwnerBusinessRegistrationPage />,
      },
      { path: "owner/store-info/:shopId", element: <OwnerStoreInfoPage /> },
      { path: "owner/store-intro/:shopId", element: <OwnerStoreIntroPage /> },
      { path: "owner/sales/:shopId", element: <OwnerSalesPage /> },
      { path: "owner/hours/:shopId", element: <OwnerBusinessHoursPage /> },
      { path: "owner/treatments/edit/:shopId/:treatmentId", element: <OwnerEditTreatmentPage />},
      { path: "owner/treatments/create/:shopId", element: <OwnerCreateTreatmentPage />},
      { path: "owner/announcements/edit/:shopId/:noticeId", element: <OwnerEditAnnouncementPage />},
      { path: "owner/announcements/create/:shopId", element: <OwnerCreateAnnouncementPage />},
      
      { path: "terms", element: <TermsPage /> },
      { path: "privacy", element: <PrivacyPage /> },
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

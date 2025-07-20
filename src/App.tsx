import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReservationListPage from "./pages/User/Reservation/ReservationListPage";
import ReservationDetailPage from "./pages/User/Reservation/ReservationDetailPage";
import Layout from "./layout/Layout";
import ReservationWrapper from "./layout/ReservationWrapper";
import UserChatListPage from "./pages/User/Chat/UserChatListPage";
import ManagerChatListPage from "./pages/Manager/Chat/ManagerChatListPage";
import TemplateListPage from "./pages/Manager/Chat/TemplateListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFoundPage />,
    children: [
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
        path: "userchat",
        element: <UserChatListPage />,
      },
      {
        path: "managerchat",
        element: <ManagerChatListPage />,
      },
      {
        path: "templates",
        element: <TemplateListPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

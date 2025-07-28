import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import ManagerChatListPage from "./pages/Manager/Chat/ManagerChatListPage";
import TemplateListPage from "./pages/Manager/Chat/TemplateListPage";
import ManagerChatPage from "./pages/Manager/Chat/ManagerChatPage";
import TemplateFormPage from "./pages/Manager/Chat/TemplateFormPage";
import ChatProfilePage from "./pages/Manager/Chat/ChatProfilePage";

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
        path: "chat/rooms",
        element: <ManagerChatListPage />,
      },
      {
        path: "chat/rooms/:roomId",
        element: <ManagerChatPage />,
      },
      {
        path: "chat/profile",
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

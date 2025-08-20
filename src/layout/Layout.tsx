import ManagerNavbar from "./ManagerNavbar";
import UserNavbar from "./UserNavbar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const showUserNavbar = path.startsWith("/client/mypage");

  const showManagerNavbar =
    ((path.startsWith("/manager") && !path.startsWith("/manager/onboard")) ||
      path.startsWith("/client") ||
      path.startsWith("/templates")) &&
    !showUserNavbar;

  return (
    <div>
      <Outlet />
      {showManagerNavbar && <ManagerNavbar />}
      {showUserNavbar && <UserNavbar />}
    </div>
  );
}

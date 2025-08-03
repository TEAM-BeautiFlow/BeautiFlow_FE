import Header from "./Header";
import ManagerNavbar from "./ManagerNavbar";
import UserNavbar from "./UserNavbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            {/* <Header /> */}
            <Outlet />
            {/* <ManagerNavbar />
            <UserNavbar /> */}
        </div>
    )
}
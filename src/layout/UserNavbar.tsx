import { NavLink } from "react-router-dom";
import StoreIcon from "../assets/icons/StoreIcon";
import ChatIcon from "../assets/icons/ChatIcon";
import ReservationIcon from "../assets/icons/ReservationIcon";
import MyPageIcon from "../assets/icons/MyPageIcon";

type NavItem = {
  to: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const NAV_LINKS: NavItem[] = [
  { to: "/store", label: "매장", icon: StoreIcon },
  {
    to: "/user/chat/rooms",
    label: "채팅",
    icon: ChatIcon,
  },
  {
    to: "/reservations",
    label: "예약",
    icon: ReservationIcon,
  },
  {
    to: "/mypage",
    label: "마이페이지",
    icon: MyPageIcon,
  },
];

export default function UserNavbar() {
  return (
    <div className="fixed bottom-0 h-[87px] w-[375px] border-t border-[var(--color-grey-850)] bg-[var(--color-grey-1000)] px-9 py-[18px]">
      <div className="flex w-full justify-between">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex w-[55px] flex-col items-center gap-1 ${
                isActive
                  ? "text-[var(--color-purple)]"
                  : "text-[var(--color-grey-650)]"
              }`
            }
          >
            <Icon className="h-7 w-7" />
            <span className="caption1">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

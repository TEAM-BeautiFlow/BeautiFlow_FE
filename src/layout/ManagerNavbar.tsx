import { NavLink } from "react-router-dom";
import ReservationListIcon from "../assets/icons/ReservationListIcon";
import ClientIcon from "../assets/icons/ClientIcon";
import ChatIcon from "../assets/icons/ChatIcon";
import StoreIcon from "../assets/icons/StoreIcon";
import MoreIcon from "../assets/icons/MoreIcon";

type NavItem = {
  to: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const NAV_LINKS: NavItem[] = [
  { to: "/manager/home", label: "예약", icon: ReservationListIcon },

  { to: "/mangedCustomer", label: "고객", icon: ClientIcon },
  {
    to: "/chat/rooms",
    label: "채팅",
    icon: ChatIcon,
  },
  { to: "/owner/store-info/:shopId", label: "매장", icon: StoreIcon },

  {
    to: "/manager/mypage",
    label: "더보기",
    icon: MoreIcon,
  },
];

export default function ManagerNavbar() {
  return (
    <div className="fixed bottom-0 left-1/2 h-[87px] w-[375px] -translate-x-1/2 border-t border-[var(--color-grey-850)] bg-[var(--color-grey-1000)] px-7 py-[18px]">
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

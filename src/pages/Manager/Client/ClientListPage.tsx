import { useState } from "react";
import ClientHeader from "./components/ClientHeader";
import ManagerNavbar from "../../../layout/ManagerNavbar";

export default function ClientListPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
  };

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      <ClientHeader
        title="고객 관리"
        rightContent={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.927 17.0401L20.4001 20.4001M19.2801 11.4401C19.2801 15.77 15.77 19.2801 11.4401 19.2801C7.11019 19.2801 3.6001 15.77 3.6001 11.4401C3.6001 7.11019 7.11019 3.6001 11.4401 3.6001C15.77 3.6001 19.2801 7.11019 19.2801 11.4401Z"
              stroke="#F3F3F3"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        }
        isSearchOpen={isSearchOpen}
        onRightClick={toggleSearch}
      />
      <ManagerNavbar />
    </div>
  );
}

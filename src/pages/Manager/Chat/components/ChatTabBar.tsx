import { useNavigate } from "react-router-dom";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = ["채팅", "템플릿"];

export default function ReservationTabBar({ activeTab, setActiveTab }: Props) {
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="relative h-[36px] py-[3px]">
        <div className="flex gap-4 border-b border-[var(--color-grey-750)] px-5">
          {tabs.map(tab => (
            <button
              onClick={() => {
                setActiveTab(tab);
                if (tab === "채팅") navigate("/managerchat");
                if (tab === "템플릿") navigate("/templates");
              }}
              className={`h1 flex h-[36px] cursor-pointer items-center justify-center px-1 transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-[var(--color-grey-150)] text-[var(--color-grey-150)]"
                  : "text-[var(--color-grey-750)] hover:text-[var(--color-grey-150)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

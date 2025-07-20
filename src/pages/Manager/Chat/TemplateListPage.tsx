import { useState } from "react";
import ChatTabBar from "./components/ChatTabBar";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import { useNavigate } from "react-router-dom";
import TemplateFormPage from "./TemplateFormPage";

export default function TemplateListPage() {
  const [activeTab, setActiveTab] = useState("템플릿");
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);

  return (
    <div className="relative h-screen w-[375px] bg-[var(--color-grey-1000)]">
      <div className="">
        <h1 className="mx-1 h-[101px] px-4 pt-18 pb-10 text-2xl font-bold tracking-tighter text-[var(--color-purple)] transition-colors">
          BEAUTIFLOW
        </h1>
        <ChatTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <button
        onClick={() => setIsTemplateFormOpen(true)}
        className="absolute right-6 bottom-32 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--color-purple)] shadow-lg"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill="#A83DFF" />
          <path
            d="M20 12L20 28"
            stroke="#DDDDDD"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M12 20H28"
            stroke="#DDDDDD"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <ManagerNavbar />

      {/* 조건부로 TemplateFormPage 띄우기 */}
      {isTemplateFormOpen && (
        <div className="absolute top-0 left-0 z-50 h-full w-full">
          <TemplateFormPage onClose={() => setIsTemplateFormOpen(false)} />
        </div>
      )}
    </div>
  );
}

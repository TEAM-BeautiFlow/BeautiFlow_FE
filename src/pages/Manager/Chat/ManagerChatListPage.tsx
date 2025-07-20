import { useState } from "react";
import ChatTabBar from "./components/ChatTabBar";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
interface ChatItem {
  id: number;
  name: string;
  message: string;
  unread: number;
}

const dummyChats: ChatItem[] = [
  {
    id: 1,
    name: "상대방 이름",
    message: "예약했던 시간보다 5분정도 늦을 것 s같아요 죄송합니다...",
    unread: 9,
  },
  {
    id: 2,
    name: "상대방 이름",
    message: "예약했던 시간보다 5분정도 늦을 것 같아요 죄송합니다...",
    unread: 0,
  },
];
export default function ManagerChatListPage() {
  const [activeTab, setActiveTab] = useState("채팅");
  const [chats] = useState<ChatItem[]>(dummyChats);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatItem[] | null>(null);

  const openBottomSheet = (chat: ChatItem[]) => {
    setSelectedChat(chat);
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setSelectedChat(null);
  };

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const openAlert = (id: number) => {
    setSelectedChatId(id);
    setIsAlertOpen(true);
  };
  const closeAlert = () => setIsAlertOpen(false);

  const handleDeleteChat = () => {
    // 삭제 로직 구현 (예: 상태 변경 또는 API 호출)
    console.log("채팅 삭제됨!");
  };

  return (
    <div className="relative h-screen w-[375px] bg-[var(--color-grey-1000)]">
      <div className="">
        <h1 className="mx-1 h-[101px] px-4 pt-18 pb-10 text-2xl font-bold tracking-tighter text-[var(--color-purple)] transition-colors">
          BEAUTIFLOW
        </h1>
        <ChatTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {/* 채팅 리스트 */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            onContextMenu={e => {
              e.preventDefault();
              openBottomSheet(chat);
            }}
            className="flex items-center justify-between px-5 py-4"
          >
            <div className="h-10 w-10 self-start rounded-full">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="#3A3A3A" />
                <path
                  d="M32.6501 14.275C39.6246 15.6933 34.6096 29.3353 27.6248 30.7086C25.9997 31.0282 24.9667 31.1437 23.3726 30.7086C18.5143 29.3827 25.0573 21.8036 19.9966 21.7493C14.9199 21.6948 21.3383 29.3737 16.466 30.7086C14.8821 31.1426 13.8566 31.0418 12.2396 30.7322C5.25651 29.3953 0.427964 15.6846 7.39473 14.275C8.87021 13.9765 9.79684 13.9288 11.2603 14.275C16.5638 15.5298 8.96268 26.8631 14.4301 27.0358C19.944 27.21 12.7449 15.5546 18.0896 14.275C19.6106 13.9109 20.5903 13.9058 22.1098 14.275C27.4022 15.5611 20.0959 27.0568 25.5631 26.9652C31.0064 26.874 23.4838 15.5348 28.7587 14.275C30.2311 13.9234 31.1651 13.9731 32.6501 14.275Z"
                  fill="#6E6E6E"
                />
              </svg>
            </div>
            <div className="flex w-[231px] flex-col gap-1 self-start">
              <div className="">
                <span className="label1 text-[var(--color-grey-50)]">
                  {chat.name}
                </span>
              </div>
              <p className="caption2 text-[var(--color-grey-450)]">
                {chat.message}
              </p>
            </div>

            <div
              className={`caption1 flex h-6 w-6 items-center justify-center gap-2.5 rounded-full ${
                chat.unread === 0
                  ? "bg-[var(--color-grey-1000"
                  : "bg-[var(--color-purple)] text-[var(--color-grey-1000)]"
              } `}
            >
              {chat.unread}
            </div>
          </div>
        ))}
      </div>
      <button className="absolute right-6 bottom-32 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-purple)] shadow-lg">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="22" />
          <path
            d="M22 23.5V17.5M19 20.5H25M17 28V30.3355C17 30.8684 17 31.1348 17.1092 31.2716C17.2042 31.3906 17.3483 31.4599 17.5005 31.4597C17.6756 31.4595 17.8837 31.2931 18.2998 30.9602L20.6852 29.0518C21.1725 28.662 21.4162 28.4671 21.6875 28.3285C21.9282 28.2055 22.1844 28.1156 22.4492 28.0613C22.7477 28 23.0597 28 23.6837 28H26.2C27.8802 28 28.7202 28 29.362 27.673C29.9265 27.3854 30.3854 26.9265 30.673 26.362C31 25.7202 31 24.8802 31 23.2V17.8C31 16.1198 31 15.2798 30.673 14.638C30.3854 14.0735 29.9265 13.6146 29.362 13.327C28.7202 13 27.8802 13 26.2 13H17.8C16.1198 13 15.2798 13 14.638 13.327C14.0735 13.6146 13.6146 14.0735 13.327 14.638C13 15.2798 13 16.1198 13 17.8V24C13 24.93 13 25.395 13.1022 25.7765C13.3796 26.8117 14.1883 27.6204 15.2235 27.8978C15.605 28 16.07 28 17 28Z"
            stroke="#F3F3F3"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <ManagerNavbar />
      {isBottomSheetOpen && (
        <div
          className="absolute bottom-0 flex h-full items-end justify-center bg-[#0C0D1199]"
          onClick={closeBottomSheet}
        >
          {/* 하단 시트 영역 */}
          <div
            onClick={e => e.stopPropagation()}
            className="flex w-[375px] flex-col items-start gap-[10px] rounded-t-xl bg-[var(--color-grey-850)] pt-2 pb-10"
          >
            <div className="mx-auto flex flex-col items-center p-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="47"
                height="6"
                viewBox="0 0 47 6"
                fill="none"
              >
                <path
                  d="M3.5 3H43.5"
                  stroke="#545454"
                  stroke-width="6"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-[23px] px-5">
              <div className="label1 text-[var(--color-grey-550)]">
                {selectedChat?.name}
              </div>
              <button
                className="title2 cursor-pointer text-left text-[#D2636A]"
                onClick={() => {
                  if (selectedChat) {
                    closeBottomSheet();
                    openAlert(selectedChat.id);
                  }
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onDelete={handleDeleteChat}
      />
      ;
    </div>
  );
}

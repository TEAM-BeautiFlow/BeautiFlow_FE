import UserNavbar from "../../../layout/UserNavbar";
import { useState } from "react";
import ChatListHeader from "./components/ChatListHeader";

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

export default function ChatList() {
  const [chats] = useState<ChatItem[]>(dummyChats);

  return (
    <div className="flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 네비게이션 */}
      <ChatListHeader />

      {/* 채팅 리스트 */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
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
      <UserNavbar />
    </div>
  );
}

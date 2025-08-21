import type { ChatList } from "../../../../types/chatlist";

interface ChatRoomListProps {
  chat: ChatList;
  onRightClick: (chat: ChatList) => void;
  onClick: (roomId: number) => void;
}

export default function ChatRoomList({
  chat,
  onRightClick,
  onClick,
}: ChatRoomListProps) {
  return (
    <div
      key={chat.roomId}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(chat);
      }}
      onClick={() => onClick(chat.roomId)}
      className="flex cursor-pointer items-center justify-between px-5 py-4"
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
        <div className="flex gap-2">
          <span className="caption1 inline-block gap-2.5 rounded-[8px] bg-[var(--color-grey-850)] px-2 py-1 text-[var(--color-grey-50)]">
            {chat.shopName}
          </span>
          <span className="label1 text-[var(--color-grey-50)]">
            {chat.opponentName}
          </span>
        </div>
        <p className="caption2 text-[var(--color-grey-450)]">
          {chat.lastMessageContent}
        </p>
      </div>

      <div
        className={`caption1 flex h-6 w-6 items-center justify-center gap-2.5 rounded-full ${
          chat.unreadCount === 0
            ? "bg-[var(--color-grey-1000 text-[var(--color-grey-1000)]"
            : "bg-[var(--color-purple)] text-[var(--color-grey-1000)]"
        } `}
      >
        {chat.unreadCount}
      </div>
    </div>
  );
}

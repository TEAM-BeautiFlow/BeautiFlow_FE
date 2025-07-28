import type { ChatList } from "../../../../types/chatlist";

interface ChatListModalProps {
  selectedChat: ChatList;
  onClose: () => void;
  onDeleteClick: (roomId: number) => void;
}

export default function ChatListModal({
  selectedChat,
  onClose,
  onDeleteClick,
}: ChatListModalProps) {
  return (
    <div
      className="absolute bottom-0 flex h-full items-end justify-center bg-[#0C0D1199]"
      onClick={onClose}
    >
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
          </svg>{" "}
        </div>
        <div className="flex flex-col gap-[23px] px-5">
          <div className="label1 text-[var(--color-grey-550)]">
            {selectedChat.opponentName}
          </div>
          <button
            className="title2 cursor-pointer text-left text-[#D2636A]"
            onClick={() => {
              onClose();
              onDeleteClick(selectedChat.roomId);
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

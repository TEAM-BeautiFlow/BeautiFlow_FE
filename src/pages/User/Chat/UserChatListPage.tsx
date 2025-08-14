import UserNavbar from "../../../layout/UserNavbar";
import { useState } from "react";
import ChatListHeader from "./components/ChatListHeader";
import type { ChatList } from "../../../types/chatlist";
import ChatRoomList from "./components/ChatRoomList";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import DeleteModal from "../../../components/DeleteModal";

const dummyChats: ChatList[] = [
  {
    roomId: 1,
    shopId: 2,
    shopName: "샵이름",
    opponentId: 1,
    opponentName: "상대방 이름",
    lastMessageContent:
      "예약했던 시간보다 5분정도 늦을 것 같아요 죄송합니다...",
    lastMessageTime: "2025-07-21T15:00:00",
    unreadCount: 9,
  },
  {
    roomId: 2,
    shopId: 2,
    shopName: "샵이름",
    opponentId: 1,
    opponentName: "상대방 이름",
    lastMessageContent:
      "예약했던 시간보다 5분정도 늦을 것 같아요 죄송합니다...",
    lastMessageTime: "2025-07-21T15:00:00",
    unreadCount: 9,
  },
];

export default function UserChatListPage() {
  const [chats] = useState<ChatList[]>(dummyChats);
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<ChatList | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // room 클릭 시 이동
  const handleChatClick = (roomId: number) => {
    navigate(`/user/chat/rooms/${roomId}`);
  };

  // 모달
  const openBottomSheet = (chat: ChatList) => {
    setSelectedChat(chat);
    setIsBottomSheetOpen(true);
  };

  // const closeBottomSheet = () => {
  //   setIsBottomSheetOpen(false);
  //   setSelectedChat(null);
  // };
  // 모달2
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const openAlert = (_roomId: number) => {
    setIsAlertOpen(true);
  };

  // 삭제 기능
  const handleDeleteChat = () => {
    // 삭제 로직 구현해야함
    console.log("채팅 삭제됨!");
  };

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 네비게이션 */}
      <ChatListHeader />

      {/* 채팅 리스트 */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {chats.map(chat => (
          <ChatRoomList
            key={chat.roomId}
            chat={chat}
            onRightClick={openBottomSheet}
            onClick={handleChatClick}
          />
        ))}
      </div>
      <UserNavbar />
      {/* 모달 */}
      {isBottomSheetOpen && selectedChat && (
        <DeleteModal
          visible={!!selectedChat}
          targetName={selectedChat?.opponentName || ""}
          onClose={() => setSelectedChat(null)}
          onConfirm={() => openAlert(selectedChat.roomId)}
        />
      )}
      <DeleteConfirmModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onDelete={handleDeleteChat}
      />
    </div>
  );
}

import UserNavbar from "../../../layout/UserNavbar";
import { useState } from "react";
import ChatListHeader from "./components/ChatListHeader";
import type { ChatList } from "../../../types/chatlist";
import ChatRoomList from "./components/ChatRoomList";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import DeleteModal from "../../../components/DeleteModal";

export default function UserChatListPage() {
  const [chats] = useState<ChatList[]>([]);
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<ChatList | null>(null);
  const [, setSelectedChatId] = useState<number | null>();
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
  const openAlert = (roomId: number) => {
    setSelectedChatId(roomId);
    setIsAlertOpen(true);
  };

  // const closeAlert = () => setIsAlertOpen(false);

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

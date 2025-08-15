import UserNavbar from "../../../layout/UserNavbar";
import { useEffect, useState } from "react";
import ChatListHeader from "./components/ChatListHeader";
import type { ChatList } from "../../../types/chatlist";
import ChatRoomList from "./components/ChatRoomList";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import DeleteModal from "../../../components/DeleteModal";
import axios from "axios";

export default function UserChatListPage() {
  const [chats, setChats] = useState<ChatList[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatList | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // 채팅 리스트 불러오기
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access Token이 없습니다.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/chat/rooms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // 안전하게 배열만 set
        if (Array.isArray(response.data?.data)) {
          const activeChats = response.data.data.filter(
            (chat: ChatList) => !chat.isExited,
          );
          setChats(activeChats);
        } else {
          console.warn("채팅 리스트 응답이 배열이 아닙니다:", response.data);
        }
      } catch (error) {
        console.error("채팅 리스트 불러오기 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatList();
  }, []);

  // room 클릭 시 이동
  const handleChatClick = (
    roomId: number,
    opponentId: number,
    opponentName: string,
    shopName: string,
  ) => {
    navigate(`/user/chat/rooms/${roomId}`, {
      state: {
        designerId: opponentId,
        designerName: opponentName,
        shopName: shopName,
      },
    });
  };

  // 모달
  const openBottomSheet = (chat: ChatList) => {
    setSelectedChat(chat);
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setSelectedChat(null);
  };

  // 모달2
  const openAlert = (roomId: number) => {
    setSelectedChatId(roomId);
    setIsAlertOpen(true);
    setIsBottomSheetOpen(false);
  };

  // 삭제 기능
  const handleDeleteChat = async () => {
    if (!selectedChatId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access Token이 없습니다.");
      return;
    }
    try {
      setDeleting(true);
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/chat/rooms/${selectedChatId}/exit`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setChats(prev => prev.filter(c => c.roomId !== selectedChatId));

      setSelectedChatId(null);
      setIsAlertOpen(false);
      setDeleting(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("채팅방 나가기 실패", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      } else {
        console.error("알 수 없는 오류", error);
      }
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 네비게이션 */}
      <ChatListHeader />

      {/* 채팅 리스트 */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {loading ? (
          <p className="body2 mt-10 text-center text-[var(--color-grey-450)]">
            채팅 목록 불러오는 중...
          </p>
        ) : chats.length > 0 ? (
          chats
            .filter(chat => !chat.isExited)
            .map(chat => (
              <ChatRoomList
                key={chat.roomId}
                chat={chat}
                onRightClick={openBottomSheet}
                onClick={roomId =>
                  handleChatClick(
                    roomId,
                    chat.opponentId,
                    chat.opponentName,
                    chat.shopName,
                  )
                }
              />
            ))
        ) : (
          <p className="body2 mt-10 text-center text-[var(--color-grey-450)]">
            채팅이 없습니다.
          </p>
        )}
      </div>
      <UserNavbar />
      {/* 모달 */}
      {isBottomSheetOpen && selectedChat && (
        <DeleteModal
          visible={!!selectedChat}
          targetName={selectedChat.opponentName ?? ""}
          onClose={closeBottomSheet}
          onConfirm={() => openAlert(selectedChat.roomId)}
        />
      )}
      <DeleteConfirmModal
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setDeleting(false);
        }}
        onDelete={handleDeleteChat}
        confirmDisabled={deleting}
      />
    </div>
  );
}

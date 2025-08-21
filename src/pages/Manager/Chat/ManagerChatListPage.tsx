import { useEffect, useState } from "react";
import ChatTabBar from "./components/ChatTabBar";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { ChatList } from "../../../types/chatlist";
import ChatRoomList from "./components/ChatRoomList";
import DeleteModal from "../../../components/DeleteModal";
import Header from "@/layout/Header";

export default function ManagerChatListPage() {
  const [activeTab, setActiveTab] = useState("채팅");
  const [chats, setChats] = useState<ChatList[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatList | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const toMs = (t: string) => {
    // 빈 문자열, 잘못된 포맷 방어
    if (!t) return 0;
    const n = Date.parse(t); // "2025-08-21T02:12:34Z" 같은 ISO 문자열 가정
    return Number.isNaN(n) ? 0 : n;
  };

  const sortByLastMessageDesc = (a: ChatList, b: ChatList) => {
    const ta = toMs(a.lastMessageTime);
    const tb = toMs(b.lastMessageTime);
    if (tb !== ta) return tb - ta; // 최신이 먼저
    // 동시간인 경우 roomId로 안정 정렬
    return b.roomId - a.roomId;
  };

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
          const activeChats = response.data.data;
          activeChats.sort(sortByLastMessageDesc);

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

  const selectCustomer = () => {
    navigate("/chat/rooms/groupset");
  };

  // room 클릭 시 이동
  const handleChatClick = (
    roomId: number,
    opponentId: number,
    opponentName: string,
  ) => {
    navigate(`/chat/rooms/${roomId}`, {
      state: {
        customerId: opponentId,
        name: opponentName,
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
    <div className="relative mx-auto h-screen w-[375px] bg-[var(--color-grey-1000)]">
      {/* 상단 */}
      <div className="">
        <Header />
        <ChatTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {/* 채팅 리스트 */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {loading ? (
          <p className="body2 mt-10 text-center text-[var(--color-grey-450)]">
            채팅 목록 불러오는 중...
          </p>
        ) : chats.length > 0 ? (
          chats.map(chat => (
            <ChatRoomList
              key={chat.roomId}
              chat={chat}
              onRightClick={openBottomSheet}
              onClick={roomId =>
                handleChatClick(roomId, chat.opponentId, chat.opponentName)
              }
            />
          ))
        ) : (
          <p className="body2 mt-10 text-center text-[var(--color-grey-450)]">
            아직 채팅이 없습니다.
          </p>
        )}
      </div>
      {/* 버튼 */}
      <button
        onClick={selectCustomer}
        className="absolute right-6 bottom-32 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--color-purple)] shadow-lg"
      >
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
      {/* 하단 */}
      <ManagerNavbar />

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

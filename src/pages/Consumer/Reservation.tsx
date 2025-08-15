import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Clock, X } from "lucide-react";
import api from "@/apis/axiosInstance";
import UserNavbar from "@/layout/UserNavbar"; // 🔽 UserNavbar를 외부 파일에서 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";
import type { ApiResponse, SShopData, Treatment } from "../../types/api";

// --- Reservation Page Component ---
const Reservation = () => {
  const navigate = useNavigate();
  const { shopId: shopIdFromParams } = useParams<{ shopId: string }>();
  const SHOP_ID = shopIdFromParams ? parseInt(shopIdFromParams) : 1;

  const [shopData, setShopData] = useState<SShopData | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState({
    id: 0,
    title: "",
    content: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<
    "HAND" | "FEET" | "ETC"
  >("HAND"); // API 명세에 맞게 영문 대문자로 변경

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<ApiResponse<SShopData>>(
          `/shops/${SHOP_ID}`,
        );
        if (response.data.success && response.data.data) {
          setShopData(response.data.data);
        } else {
          setError(response.data.message || "매장 정보 로딩 실패");
        }
      } catch (err: any) {
        console.error("API 호출 중 에러 발생:", err);
        setError(err.response?.data?.message || err.message || "알 수 없는 에러가 발생했습니다.");
      }
    };
    fetchShopData();
  }, [SHOP_ID]);

  useEffect(() => {
    if (!shopData) return;

    const fetchTreatments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse<Treatment[]>>(
          `/shops/${SHOP_ID}/treatments`,
          {
            params: { category: selectedCategory },
          },
        );
        if (response.data.success && response.data.data) {
          setTreatments(response.data.data);
        } else {
          setTreatments([]);
        }
      } catch (err) {
        console.error("시술 정보 호출 중 에러 발생:", err);
        setTreatments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTreatments();
  }, [selectedCategory, shopData, SHOP_ID]);

  const notices = shopData?.notices || [];

  const handleAnnouncementClick = (announcement: {
    id: number;
    title: string;
    content: string;
  }) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategoryClick = (categoryName: "HAND" | "FEET" | "ETC") => {
    setSelectedCategory(categoryName);
  };

  const handleTreatmentClick = (shopId: number, treatmentId: number) => {
    navigate(`/art-detail/${shopId}/${treatmentId}`);
  };

  if (isLoading && !shopData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>매장 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-500">
        <p>데이터 로딩에 실패했습니다: {error}</p>
      </div>
    );
  }
  
  if (!shopData) {
      return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div
        className="w-full max-w-sm bg-black text-white transition-filter"
        style={{ filter: isModalOpen ? "blur(4px)" : "none" }}
      >
        <header className="flex items-center justify-between px-5 py-4 bg-black">
          <span className="h1 text-[color:var(--color-purple)]">BEAUTIFLOW</span>
        </header>

        <div className="relative h-64 w-full overflow-hidden bg-[color:var(--color-grey-350)]">
          {shopData.mainImageUrl ? (
            <img
              src={shopData.mainImageUrl}
              alt={`${shopData.name} 배너 이미지`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="body1 text-[color:var(--color-grey-650)]">배너 이미지 없음</span>
            </div>
          )}
        </div>

        <section className="px-5 py-4 bg-black">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="title1 text-white">{shopData.name}</h2>
            <button className="flex items-center gap-1">
              <MessageSquare size={20} className="text-[color:var(--color-grey-450)]" />
              <span className="caption1 text-[color:var(--color-grey-450)]">채팅</span>
            </button>
          </div>
          <p className="body2 text-[color:var(--color-grey-450)] truncate">
            {shopData.introText}
          </p>

          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-2">
            {notices.map(notice => (
              <div
                key={notice.id}
                className="flex-shrink-0 cursor-pointer rounded-md p-3 bg-[color:var(--color-grey-950)] w-40"
                onClick={() => handleAnnouncementClick(notice)}
              >
                <h4 className="caption1 text-white mb-1 truncate">{notice.title}</h4>
                <p className="caption2 text-[color:var(--color-grey-450)]" style={{ lineHeight: "1.5", overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex border-b px-5 border-[color:var(--color-grey-850)] bg-black">
          <button className="label1 px-2 py-3 text-white font-semibold border-b-2 border-white">시술</button>
          <button className="label1 px-2 py-3 text-[color:var(--color-grey-450)] font-medium">정보</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 bg-black">
            <div className="mb-6 flex gap-2 bg-black">
              {(["HAND", "FEET", "ETC"] as const).map(cat => (
                <button
                  key={cat}
                  className={`caption2 rounded-full px-2.5 py-1`}
                  style={{
                    backgroundColor: selectedCategory === cat ? "var(--color-dark-purple)" : "var(--color-grey-750)",
                    border: selectedCategory === cat ? "1.5px solid var(--color-light-purple)" : "none",
                    color: selectedCategory === cat ? "#F3F3F3" : "var(--color-grey-450)",
                  }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat === 'HAND' ? '손' : cat === 'FEET' ? '발' : '기타'}
                </button>
              ))}
            </div>

            <section className="flex-1 overflow-y-auto bg-black">
              {isLoading ? (
                  <p className="body2 text-center text-[color:var(--color-grey-450)]">시술 목록을 불러오는 중...</p>
              ) : treatments.length > 0 ? (
                treatments.map(treatment => (
                  <div
                    key={treatment.id}
                    className="mb-6 cursor-pointer"
                    onClick={() => handleTreatmentClick(SHOP_ID, treatment.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-24 w-24 flex-shrink-0 rounded-md bg-[color:var(--color-grey-350)]">
                        {treatment.images && treatment.images.length > 0 && (
                          <img
                            src={treatment.images[0].imageUrl}
                            alt={treatment.name}
                            className="h-full w-full rounded-md object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-start justify-between">
                          <span className="label1 text-white">{treatment.name}</span>
                          <div className="flex flex-shrink-0 items-center gap-1">
                            <Clock size={16} className="text-[color:var(--color-grey-450)]" />
                            <span className="caption2 text-[color:var(--color-grey-450)] whitespace-nowrap">
                              {treatment.durationMinutes}분
                            </span>
                          </div>
                        </div>
                        <div className="label1 text-white mb-2">{treatment.price?.toLocaleString()}원</div>
                        <p className="body2 text-[color:var(--color-grey-450)] line-clamp-2" style={{ lineHeight: "1.5" }}>
                          {treatment.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="body2 text-center text-[color:var(--color-grey-450)]">해당 카테고리의 시술이 없습니다.</p>
              )}
            </section>
        </div>

        <UserNavbar />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity"
          onClick={handleModalClose}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-solid p-6 shadow-lg bg-black border-[color:var(--color-grey-850)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="title1 text-white">{selectedAnnouncement.title}</h2>
              <button onClick={handleModalClose}>
                <X size={24} className="text-white" />
              </button>
            </div>
            <p className="body2 text-[color:var(--color-grey-450)]" style={{ lineHeight: "1.5" }}>
              {selectedAnnouncement.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;

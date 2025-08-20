import { useState, useEffect, useMemo } from "react"; // useMemo 추가
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Clock, X, Phone, MapPin } from "lucide-react";
import api from "@/apis/axiosInstance";
import UserNavbar from "@/layout/UserNavbar";
import "../../styles/color-system.css";
import "../../styles/type-system.css";
// --- 1. SShopData 타입 필드명 변경에 대한 주석 ---
// API 명세 변경에 따라 SShopData 타입의 phoneNumber가 contact로,
// operatingHours가 businessHours 배열로 변경되었다고 가정합니다.
import type { ApiResponse, SShopData, Treatment } from "../../types/api";
import { useAuthStore } from "@/stores/auth";
import Header from "@/layout/Header";

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
  >("HAND");

  const [activeTab, setActiveTab] = useState<"TREATMENTS" | "INFO">(
    "TREATMENTS",
  );

  // --- 2. businessHours 데이터를 가공하여 표시할 문자열 생성 ---
  // API의 businessHours 배열을 사용자에게 보여주기 좋은 형태의 문자열로 변환합니다.
  const operatingHoursText = useMemo(() => {
    if (!shopData?.businessHours || shopData.businessHours.length === 0) {
      return "영업시간 정보 없음";
    }

    const formatTime = (time: string) => {
      // "09:00:00" -> "09:00"
      return time.substring(0, 5);
    };

    const firstDay = shopData.businessHours[0];
    const allDaysSame = shopData.businessHours.every(
      day =>
        !day.isClosed &&
        day.openTime === firstDay.openTime &&
        day.closeTime === firstDay.closeTime,
    );

    // 모든 요일의 영업시간이 동일한 경우
    if (allDaysSame && shopData.businessHours.length === 7) {
      return `평일 ${formatTime(firstDay.openTime)} ~ ${formatTime(firstDay.closeTime)} (월~일)`;
    }

    // 요일별 영업시간이 다른 경우, 각 요일 정보를 나열
    const dayMap: { [key: string]: string } = {
      MON: "월",
      TUE: "화",
      WED: "수",
      THU: "목",
      FRI: "금",
      SAT: "토",
      SUN: "일",
    };
    return shopData.businessHours
      .map(
        day =>
          `${dayMap[day.dayOfWeek]}: ${day.isClosed ? "휴무" : `${formatTime(day.openTime)} ~ ${formatTime(day.closeTime)}`}`,
      )
      .join("\n");
  }, [shopData]);

  useEffect(() => {
    // 마지막 방문 매장 저장
    try {
      useAuthStore.getState().setLastVisitedShopId(SHOP_ID);
    } catch {}

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
        setError(
          err.response?.data?.message ||
            err.message ||
            "알 수 없는 에러가 발생했습니다.",
        );
      }
    };
    fetchShopData();
  }, [SHOP_ID]);

  useEffect(() => {
    if (!shopData || activeTab !== "TREATMENTS") return;

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
  }, [selectedCategory, shopData, SHOP_ID, activeTab]);

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
    navigate(`/user/store/art-detail/${shopId}/${treatmentId}`);
  };

  const handleCopy = (text: string | undefined) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => alert("복사되었습니다."))
      .catch(err => console.error("복사 실패:", err));
  };

  if (isLoading && !shopData) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p>매장 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
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
        className="transition-filter w-full max-w-sm bg-[var(--color-grey-1000)] text-[var(--color-grey-150)]"
        style={{ filter: isModalOpen ? "blur(4px)" : "none" }}
      >
        <header>
          <Header />
        </header>

        <div className="relative h-64 w-full overflow-hidden bg-[color:var(--color-grey-350)]">
          {shopData.mainImageUrl ? (
            <img
              src={shopData.mainImageUrl}
              alt={`${shopData.name} 배너 이미지`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="body1 text-[color:var(--color-grey-650)]">
                배너 이미지 없음
              </span>
            </div>
          )}
        </div>

        <section className="bg-[var(--color-grey-1000)]] px-5 py-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="h0 text-[var(--color-grey-150)]">{shopData.name}</h2>
            <button className="flex items-center gap-1">
              <MessageSquare
                size={20}
                className="text-[color:var(--color-grey-450)]"
              />
              <span className="caption1 text-[color:var(--color-grey-450)]">
                채팅
              </span>
            </button>
          </div>
          <p className="body1 truncate text-[color:var(--color-grey-450)]">
            {shopData.introText}
          </p>

          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-2">
            {notices.map(notice => (
              <div
                key={notice.id}
                className="w-40 flex-shrink-0 cursor-pointer rounded-md bg-[color:var(--color-grey-950)] p-3"
                onClick={() => handleAnnouncementClick(notice)}
              >
                <h4 className="body1 mb-1 truncate text-[var(--color-grey-350)]">
                  {notice.title}
                </h4>
                <p
                  className="caption2 text-[color:var(--color-grey-550)]"
                  style={{
                    lineHeight: "1.5",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex border-b border-[color:var(--color-grey-850)] bg-[var(--color-grey-1000)] px-5">
          <button
            onClick={() => setActiveTab("TREATMENTS")}
            className={`h1 px-2 py-3 ${
              activeTab === "TREATMENTS"
                ? "border-b-2 border-[var(--color-grey-150)] text-[var(--color-grey-150)]"
                : "text-[color:var(--color-grey-750)]"
            }`}
          >
            시술
          </button>
          <button
            onClick={() => setActiveTab("INFO")}
            className={`h1 px-2 py-3 ${
              activeTab === "INFO"
                ? "border-b-2 border-[var(--color-grey-150)] text-[var(--color-grey-150)]"
                : "text-[color:var(--color-grey-750)]"
            }`}
          >
            정보
          </button>
        </div>

        <div className="bg-[var(--color-grey-1000)]] flex-1 overflow-y-auto px-5 py-4 pb-32">
          {activeTab === "TREATMENTS" ? (
            <>
              <div className="bg-[var(--color-grey-1000)]] mb-6 flex gap-2">
                {(["HAND", "FEET", "ETC"] as const).map(cat => (
                  <button
                    key={cat}
                    className={`caption2 rounded-full px-2.5 py-1`}
                    style={{
                      backgroundColor:
                        selectedCategory === cat
                          ? "var(--color-dark-purple)"
                          : "var(--color-grey-750)",
                      border:
                        selectedCategory === cat
                          ? "1.5px solid var(--color-light-purple)"
                          : "none",
                      color:
                        selectedCategory === cat
                          ? "#F3F3F3"
                          : "var(--color-grey-450)",
                    }}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat === "HAND" ? "손" : cat === "FEET" ? "발" : "기타"}
                  </button>
                ))}
              </div>

              <section className="flex-1 overflow-y-auto bg-[var(--color-grey-1000)]">
                {isLoading ? (
                  <p className="body2 text-center text-[color:var(--color-grey-450)]">
                    시술 목록을 불러오는 중...
                  </p>
                ) : treatments.length > 0 ? (
                  treatments.map(treatment => (
                    <div
                      key={treatment.id}
                      className="mb-6 cursor-pointer"
                      onClick={() =>
                        handleTreatmentClick(SHOP_ID, treatment.id)
                      }
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
                            <span className="label1 text-[var(--color-grey-50)]">
                              {treatment.name}
                            </span>
                            <div className="flex flex-shrink-0 items-center gap-1 rounded-[3px] bg-[var(--color-grey-950)] px-2 py-1">
                              <Clock
                                size={16}
                                className="text-[color:var(--color-grey-550)]"
                              />
                              <span className="caption1 whitespace-nowrap text-[color:var(--color-grey-550)]">
                                {treatment.durationMinutes}분
                              </span>
                            </div>
                          </div>
                          <div className="label1 mb-2 text-[var(--color-grey-350)]">
                            {treatment.price?.toLocaleString()}원
                          </div>
                          <p
                            className="body2 line-clamp-2 text-[color:var(--color-grey-550)]"
                            style={{ lineHeight: "1.5" }}
                          >
                            {treatment.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="body2 text-center text-[color:var(--color-grey-450)]">
                    해당 카테고리의 시술이 없습니다.
                  </p>
                )}
              </section>
            </>
          ) : (
            // --- 3. 정보 탭 UI 변수명 수정 ---
            <section className="space-y-6 py-4">
              <div className="flex items-start gap-3">
                <Clock
                  size={20}
                  className="flex-shrink-0 text-[color:var(--color-grey-450)]"
                />
                {/* `operatingHoursText`를 사용하여 가공된 영업시간을 표시합니다. */}
                <span className="body2 whitespace-pre-line text-[var(--color-grey-150)]">
                  {operatingHoursText}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone
                    size={20}
                    className="flex-shrink-0 text-[color:var(--color-grey-450)]"
                  />
                  {/* `phoneNumber`를 `contact`로 변경합니다. */}
                  <span className="body2 text-[var(--color-grey-150)]">
                    {shopData.contact}
                  </span>
                </div>
                {/* `phoneNumber`를 `contact`로 변경합니다. */}
                <button
                  onClick={() => handleCopy(shopData.contact)}
                  className="body2 text-[color:var(--color-purple)]"
                >
                  복사
                </button>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="flex-shrink-0 text-[color:var(--color-grey-450)]"
                  />
                  <span className="body2 text-[var(--color-grey-150)]">
                    {shopData.address}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(shopData.address)}
                  className="body2 text-[color:var(--color-purple)]"
                >
                  복사
                </button>
              </div>
            </section>
          )}
        </div>

        <UserNavbar />
      </div>

      {isModalOpen && (
        <div
          className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity"
          onClick={handleModalClose}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-solid border-[color:var(--color-grey-850)] bg-black p-6 shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="title1 text-[var(--color-grey-150)]">
                {selectedAnnouncement.title}
              </h2>
              <button onClick={handleModalClose}>
                <X size={24} className="text-[var(--color-grey-150)]" />
              </button>
            </div>
            <p
              className="body2 text-[color:var(--color-grey-450)]"
              style={{ lineHeight: "1.5" }}
            >
              {selectedAnnouncement.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;

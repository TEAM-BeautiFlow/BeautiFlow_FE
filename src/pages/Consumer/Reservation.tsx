import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Clock, Home, Calendar, User, X } from "lucide-react";
import "../../styles/color-system.css";
import "../../styles/type-system.css";
import type { ApiResponse, SShopData, Treatment } from "../../types/api";

const Reservation = () => {
  const navigate = useNavigate();
  const [shopData, setShopData] = useState<SShopData | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<
    "hand" | "foot" | "etc"
  >("hand");

  const SHOP_ID = 1;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<ApiResponse<SShopData>>(
          `${API_BASE_URL}/shops/${SHOP_ID}`,
        );

        if (response.data.success && response.data.data) {
          setShopData(response.data.data);
        } else {
          setError(response.data.message || "매장 정보 로딩 실패");
        }
      } catch (err) {
        console.error("API 호출 중 에러 발생:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("알 수 없는 에러가 발생했습니다.");
        }
      } finally {
        // 이 isLoading은 시술 정보 로딩이 끝날 때까지 유지됩니다.
      }
    };
    fetchShopData();
  }, []);

  useEffect(() => {
    if (!shopData) return;

    const fetchTreatments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse<Treatment[]>>(
          `${API_BASE_URL}/shops/${SHOP_ID}/treatments`,
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
  }, [selectedCategory, shopData]);

  const notices = shopData?.notices || [];

  const handleAnnouncementClick = (announcement: {
    title: string;
    content: string;
  }) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategoryClick = (categoryName: "hand" | "foot" | "etc") => {
    setSelectedCategory(categoryName);
  };

  const handleTreatmentClick = (shopId: number, treatmentId: number) => {
    navigate(`/art-detail/${shopId}/${treatmentId}`);
  };

  if (isLoading || !shopData) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
        }}
      >
        <p>매장 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-red)",
        }}
      >
        <p>데이터 로딩에 실패했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--color-white)" }}
    >
      <div
        className="transition-filter w-full max-w-sm"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
          filter: isModalOpen ? "blur(4px)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "var(--color-black)",
            color: "var(--color-white)",
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="3"
                width="18"
                height="6"
                rx="2"
                stroke="white"
                strokeWidth="1"
              />
              <rect x="20" y="4" width="2" height="4" rx="1" fill="white" />
            </svg>
          </div>
        </div>

        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          <span className="h1" style={{ color: "var(--color-purple)" }}>
            BEAUTIFLOW
          </span>
        </header>

        <div
          className="relative h-64 w-full overflow-hidden"
          style={{ backgroundColor: "var(--color-grey-350)" }}
        >
          {shopData.mainImageUrl ? (
            <img
              src={shopData.mainImageUrl}
              alt={`${shopData.name} 배너 이미지`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="body1"
                  style={{ color: "var(--color-grey-650)" }}
                >
                  배너 이미지
                </span>
              </div>
            </div>
          )}
        </div>

        <section
          className="px-5 py-4"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="title1" style={{ color: "var(--color-white)" }}>
              {shopData.name}
            </h2>
            <button className="flex items-center gap-1">
              <MessageSquare size={20} color="var(--color-grey-450)" />
              <span
                className="caption1"
                style={{ color: "var(--color-grey-450)" }}
              >
                채팅
              </span>
            </button>
          </div>
          <p className="body2" style={{ color: "var(--color-grey-450)" }}>
            {shopData.introText}
            <button
              className="body2 ml-1 inline-block"
              style={{ color: "var(--color-grey-450)" }}
            >
              더보기
            </button>
          </p>

          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-2">
            {notices.map(notice => (
              <div
                key={notice.id}
                className="flex-shrink-0 cursor-pointer rounded-md p-3"
                style={{
                  backgroundColor: "var(--color-grey-950)",
                  width: "160px",
                }}
                onClick={() => handleAnnouncementClick(notice)}
              >
                <h4
                  className="caption1"
                  style={{ color: "var(--color-white)", marginBottom: "4px" }}
                >
                  {notice.title}
                </h4>
                <p
                  className="caption2"
                  style={{
                    color: "var(--color-grey-450)",
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

        <div
          className="flex border-b px-5"
          style={{
            borderColor: "var(--color-grey-850)",
            backgroundColor: "var(--color-black)",
          }}
        >
          <button
            className="label1 px-2 py-3"
            style={{
              color: "var(--color-white)",
              fontWeight: "var(--font-weight-semibold)",
              borderBottom: "2px solid var(--color-white)",
            }}
          >
            시술
          </button>
          <button
            className="label1 px-2 py-3"
            style={{
              color: "var(--color-grey-450)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            정보
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-5 py-4 pb-20"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          <>
            <div
              className="mb-6 flex gap-2"
              style={{ backgroundColor: "var(--color-black)" }}
            >
              <button
                className={`caption2 rounded-full px-2.5 py-1 ${selectedCategory === "hand" ? "active-category" : "inactive-category"}`}
                style={{
                  backgroundColor:
                    selectedCategory === "hand"
                      ? "var(--color-dark-purple)"
                      : "var(--color-grey-750)",
                  border:
                    selectedCategory === "hand"
                      ? "1.5px solid var(--color-light-purple)"
                      : "none",
                  color:
                    selectedCategory === "hand"
                      ? "#F3F3F3"
                      : "var(--color-grey-450)",
                }}
                onClick={() => handleCategoryClick("hand")}
              >
                손
              </button>
              <button
                className={`caption2 rounded-full px-2.5 py-1 ${selectedCategory === "foot" ? "active-category" : "inactive-category"}`}
                style={{
                  backgroundColor:
                    selectedCategory === "foot"
                      ? "var(--color-dark-purple)"
                      : "var(--color-grey-750)",
                  border:
                    selectedCategory === "foot"
                      ? "1.5px solid var(--color-light-purple)"
                      : "none",
                  color:
                    selectedCategory === "foot"
                      ? "#F3F3F3"
                      : "var(--color-grey-450)",
                }}
                onClick={() => handleCategoryClick("foot")}
              >
                발
              </button>
              <button
                className={`caption2 rounded-full px-2.5 py-1 ${selectedCategory === "etc" ? "active-category" : "inactive-category"}`}
                style={{
                  backgroundColor:
                    selectedCategory === "etc"
                      ? "var(--color-dark-purple)"
                      : "var(--color-grey-750)",
                  border:
                    selectedCategory === "etc"
                      ? "1.5px solid var(--color-light-purple)"
                      : "none",
                  color:
                    selectedCategory === "etc"
                      ? "#F3F3F3"
                      : "var(--color-grey-450)",
                }}
                onClick={() => handleCategoryClick("etc")}
              >
                기타
              </button>
            </div>

            <section
              className="flex-1 overflow-y-auto pb-20"
              style={{ backgroundColor: "var(--color-black)" }}
            >
              {treatments.map(treatment => (
                <div
                  key={treatment.id}
                  className="mb-6 cursor-pointer"
                  onClick={() => handleTreatmentClick(SHOP_ID, treatment.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-24 w-24 flex-shrink-0 rounded-md"
                      style={{ backgroundColor: "var(--color-grey-350)" }}
                    >
                      {treatment.images && treatment.images.length > 0 && (
                        <img
                          src={treatment.images?.[0]?.imageUrl}
                          alt={treatment.name}
                          className="h-full w-full rounded-md object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className="label1"
                          style={{ color: "var(--color-white)" }}
                        >
                          {treatment.name}
                        </span>
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <Clock size={16} color="var(--color-grey-450)" />
                          <span
                            className="caption2"
                            style={{
                              color: "var(--color-grey-450)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {treatment.durationMinutes}분
                          </span>
                        </div>
                      </div>

                      <div
                        className="label1"
                        style={{
                          color: "var(--color-white)",
                          marginBottom: "8px",
                        }}
                      >
                        {treatment.price?.toLocaleString()}원
                      </div>

                      <p
                        className="body2"
                        style={{
                          color: "var(--color-grey-450)",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        {treatment.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {treatments.length === 0 && !isLoading && (
                <p
                  className="body2 text-center"
                  style={{ color: "var(--color-grey-450)" }}
                >
                  해당 카테고리의 시술이 없습니다.
                </p>
              )}
            </section>
          </>
        </div>

        <nav
          className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-sm items-center justify-around py-3"
          style={{
            backgroundColor: "var(--color-black)",
            borderTop: "1px solid var(--color-grey-850)",
          }}
        >
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-grey-450)" }}
          >
            <Home size={24} />
            매장
          </button>
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-grey-450)" }}
          >
            <MessageSquare size={24} />
            채팅
          </button>
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-light-purple)" }}
          >
            <Calendar size={24} />
            예약
          </button>
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-grey-450)" }}
          >
            <User size={24} />
            마이페이지
          </button>
        </nav>
      </div>

      {isModalOpen && (
        <div
          className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity"
          onClick={handleModalClose}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-solid p-6 shadow-lg"
            style={{
              backgroundColor: "var(--color-black)",
              borderColor: "var(--color-grey-850)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="title1" style={{ color: "var(--color-white)" }}>
                {selectedAnnouncement.title}
              </h2>
              <button onClick={handleModalClose}>
                <X size={24} style={{ color: "var(--color-white)" }} />
              </button>
            </div>
            <p
              className="body2"
              style={{ color: "var(--color-grey-450)", lineHeight: "1.5" }}
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

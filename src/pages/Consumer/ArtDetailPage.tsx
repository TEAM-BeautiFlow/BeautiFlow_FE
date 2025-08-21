import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import api from "@/apis/axiosInstance"; // api 인스턴스 사용
import "../../styles/color-system.css";
import "../../styles/type-system.css";
import type { ApiResponse, Treatment } from "../../types/api";
import { getKakaoAuthUrl } from "@/apis/login";

const ArtDetailPage = () => {
  const navigate = useNavigate();
  const { shopId, treatmentId } = useParams<{
    shopId: string;
    treatmentId: string;
  }>();

  const [treatmentData, setTreatmentData] = useState<Treatment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTreatmentDetail = async () => {
      if (!shopId || !treatmentId) {
        setError("유효하지 않은 URL입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<ApiResponse<Treatment>>(
          `/shops/${shopId}/treatments/${treatmentId}`,
        );

        if (response.data.success && response.data.data) {
          setTreatmentData(response.data.data);
        } else {
          setError(response.data.message || "시술 정보 로딩 실패");
        }
      } catch (err: any) {
        console.error("API 호출 중 에러 발생:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "알 수 없는 에러가 발생했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatmentDetail();
  }, [shopId, treatmentId]);

  // --- 변경된 부분 시작 ---
  const handleModalOpen = async () => {
    // 1. 로그인 상태 확인
    const hasToken = Boolean(localStorage.getItem("accessToken"));
    if (!hasToken) {
      setIsModalOpen(true);
      return;
    }

    if (!shopId || !treatmentId) {
      alert("샵 또는 시술 정보가 올바르지 않습니다.");
      return;
    }

    try {
      // 2. 예약 프로세스 시작 (treatmentId 전송)
      const tempReservationPayload = {
        tempSaveData: {
          treatmentId: Number(treatmentId), // URL 파라미터는 문자열이므로 숫자로 변환
          selectedOptions: [], // 이 단계에서는 옵션이 없으므로 빈 배열
        },
      };

      // ✅ POST 요청으로 임시 예약 데이터 생성
      await api.post(
        `/reservations/${shopId}/process`,
        tempReservationPayload,
      );

      // 3. 예약 프로세스 시작 성공 후, 옵션 페이지 또는 예약 페이지로 분기
      try {
        const res = await api.get<ApiResponse<any>>(
          `/shops/${shopId}/treatments/${treatmentId}/options`,
        );
        const groups = res?.data?.data?.optionGroups ?? [];
        const hasEnabledItems = groups.some(
          (g: any) => g.enabled && Array.isArray(g.items) && g.items.length > 0,
        );

        if (hasEnabledItems) {
          navigate(`/user/store/treatment-options/${shopId}/${treatmentId}`);
        } else {
          navigate(`/user/store/booking/${shopId}/${treatmentId}`);
        }
      } catch (optionError) {
        console.error("옵션 정보 조회 실패:", optionError);
        // 옵션 조회를 실패하더라도 일단 옵션 선택 페이지로 보내는 것이 안전할 수 있습니다.
        navigate(`/user/store/treatment-options/${shopId}/${treatmentId}`);
      }
    } catch (processError: any) {
      console.error("예약 프로세스 시작 실패:", processError);
      setError(
        processError.response?.data?.message ||
          "예약을 시작하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
      // 사용자에게 에러를 알릴 수 있습니다. (예: alert, toast)
      alert(
        processError.response?.data?.message ||
          "예약을 시작하는 중 오류가 발생했습니다.",
      );
    }
  };
  // --- 변경된 부분 끝 ---

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleKakaoLogin = () => {
    const url = getKakaoAuthUrl("customer");
    window.location.href = url;
  };

  if (isLoading) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
        }}
      >
        <p>시술 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !treatmentData) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
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
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-black px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer border-none bg-transparent p-0"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Image Banner */}
      <div
        className="relative h-96 overflow-hidden"
        style={{ backgroundColor: "var(--color-grey-350)" }}
      >
        {treatmentData.images && treatmentData.images.length > 0 ? (
          <img
            src={treatmentData.images[0].imageUrl}
            alt={treatmentData.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="body1" style={{ color: "var(--color-grey-650)" }}>
              이미지 없음
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 pb-24">
        <h1
          className="title1"
          style={{ color: "var(--color-white)", marginBottom: "8px" }}
        >
          {treatmentData.name}
        </h1>

        <div className="mb-6 flex items-center justify-between">
          <span className="label1" style={{ color: "var(--color-purple)" }}>
            {treatmentData.price.toLocaleString()}원
          </span>
          <div
            className="flex items-center gap-1 rounded-full px-2 py-1"
            style={{ backgroundColor: "var(--color-grey-750)" }}
          >
            <Clock size={16} style={{ color: "var(--color-grey-450)" }} />
            <span
              className="caption2"
              style={{ color: "var(--color-grey-450)" }}
            >
              {treatmentData.durationMinutes}분
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            시술 정보
          </h2>
          <div
            className="body2 space-y-4"
            style={{
              color: "var(--color-grey-450)",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
          >
            <p>{treatmentData.description}</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-sm bg-black px-5 py-4">
        <button
          className="label1 w-full rounded-lg py-4"
          style={{
            background:
              "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)",
            color: "var(--color-white)",
            fontWeight: "var(--font-weight-semibold)",
          }}
          onClick={handleModalOpen}
        >
          예약하기
        </button>
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div
          className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity"
          onClick={handleModalClose}
        >
          <div
            className="w-full max-w-xs rounded-lg p-6 shadow-lg"
            style={{ backgroundColor: "var(--color-grey-850)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <p
                className="body1"
                style={{ color: "var(--color-white)", marginBottom: "16px" }}
              >
                더 깊이 있는 경험을 위해서는
                <br />
                계정이 필요해요
              </p>
              <p
                className="caption2"
                style={{ color: "var(--color-grey-450)", marginBottom: "24px" }}
              >
                로그인하고 함께 예약을 관리해보세요
              </p>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3"
                style={{ backgroundColor: "#FEE500", marginBottom: "12px" }}
                onClick={handleKakaoLogin}
              >
                <img
                  src="https://www.kakaocorp.com/page/assets/favicon/favicon-16x16.png"
                  alt="카카오 로고"
                  className="h-4 w-4"
                />
                <span
                  className="label1"
                  style={{
                    color: "#000000",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  카카오 로그인
                </span>
              </button>

              <button
                className="body2 w-full"
                style={{ color: "var(--color-grey-450)" }}
                onClick={handleModalClose}
              >
                더 둘러볼게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtDetailPage;
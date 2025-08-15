import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  X,
} from "lucide-react";
import api from "@/apis/axiosInstance"; // 🔽 1. api 인스턴스를 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// --- 타입 정의 ---
type VerificationStatus = "NONE" | "PENDING" | "VERIFIED";

const OwnerBusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 상태 관리 ---
  const [status, setStatus] = useState<VerificationStatus>("NONE");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔽 2. 컴포넌트 마운트 시 사업자등록증 정보를 불러옵니다.
  useEffect(() => {
    const fetchBusinessLicense = async () => {
      if (!shopId) {
        setError("잘못된 접근입니다.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get(`/shops/manage/${shopId}/business-license`);
        if (response.data && response.data.data) {
          const { verificationStatus, businessLicenseImageUrl } = response.data.data;
          setStatus(verificationStatus || "NONE");
          setImageUrl(businessLicenseImageUrl || null);
        }
      } catch (err) {
        // 404 에러 등은 아직 등록되지 않은 상태로 간주하고 에러 처리하지 않음
        if ((err as any).response?.status !== 404) {
          console.error("사업자등록증 정보 로딩 실패:", err);
          setError("정보를 불러오는 데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessLicense();
  }, [shopId]);

  // 🔽 3. 이미지 업로드 핸들러
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !shopId) return;

    const formData = new FormData();
    formData.append("businessLicenseImage", file);

    try {
      // POST 요청으로 이미지 업로드
      const response = await api.post(`/shops/manage/${shopId}/business-license`, formData);
      if (response.data && response.data.data) {
        // 업로드 성공 시 반환된 데이터로 상태 업데이트
        setStatus(response.data.data.verificationStatus || "PENDING");
        setImageUrl(response.data.data.businessLicenseImageUrl || null);
        alert("사업자등록증이 성공적으로 제출되었습니다.");
      }
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 🔽 4. 이미지 삭제 핸들러
  const handleDeleteImage = async () => {
    if (!shopId) return;

    if (window.confirm("업로드한 사업자등록증을 삭제하시겠습니까?")) {
      try {
        // DELETE 요청으로 이미지 삭제
        await api.delete(`/shops/manage/${shopId}/business-license`);
        setStatus("NONE");
        setImageUrl(null);
        alert("삭제되었습니다.");
      } catch (err) {
        console.error("이미지 삭제 실패:", err);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (isLoading) {
    return <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black text-white">로딩 중...</div>;
  }

  if (error) {
    return <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black text-white">{error}</div>;
  }

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Status Bar (이하 JSX는 기존 구조 유지) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ width: "4px", height: "4px", backgroundColor: "white", borderRadius: "50%" }}></div>
            <div style={{ width: "4px", height: "4px", backgroundColor: "white", borderRadius: "50%" }}></div>
            <div style={{ width: "4px", height: "4px", backgroundColor: "white", borderRadius: "50%" }}></div>
            <div style={{ width: "4px", height: "4px", backgroundColor: "white", borderRadius: "50%" }}></div>
          </div>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <rect x="1" y="3" width="18" height="6" rx="2" stroke="white" strokeWidth="1" />
            <rect x="20" y="4" width="2" height="4" rx="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px 24px",
          marginTop: "8px",
        }}
      >
        <button onClick={() => navigate(-1)} className="p-0 bg-transparent border-none cursor-pointer">
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1 className="title1" style={{ color: "var(--color-white)", margin: "0 auto" }}>
          사업자등록증
        </h1>
        <div style={{ width: "24px" }} /> {/* 중앙 정렬을 위한 더미 div */}
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {status === "PENDING" && (
          <div className="label1 mb-6 rounded-md px-4 py-3 text-center" style={{ backgroundColor: "var(--color-dark-purple)", color: "var(--color-light-purple)" }}>
            사업자등록증 확인 중
          </div>
        )}
        {status === "VERIFIED" && (
          <div className="label1 mb-6 rounded-md px-4 py-3 text-center" style={{ backgroundColor: "var(--color-dark-purple)", color: "var(--color-light-purple)" }}>
            인증이 완료되었습니다.
          </div>
        )}
        <p className="body2" style={{ color: "var(--color-grey-450)", lineHeight: "1.5", marginBottom: "24px" }}>
          뷰티플로우 전체 서비스를 이용하기 위해서는 사업자등록증을 제출해야 해요. 1주일 내로 미제출 시 서비스 이용이 제한돼요.
        </p>
        <div style={{ marginBottom: "32px" }}>
          <h2 className="label1" style={{ color: "var(--color-white)", marginBottom: "16px" }}>유의사항</h2>
          <div style={{ backgroundColor: "var(--color-grey-1000)", borderRadius: "8px", padding: "16px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li className="body2" style={{ color: "var(--color-grey-450)", lineHeight: "1.5", position: "relative", paddingLeft: "16px" }}>
                <span style={{ position: "absolute", left: "0" }}>•</span> 6개월 이내 발급된 사업자등록증을 제출해 주세요
              </li>
              <li className="body2" style={{ color: "var(--color-grey-450)", lineHeight: "1.5", position: "relative", paddingLeft: "16px" }}>
                <span style={{ position: "absolute", left: "0" }}>•</span> 서류 제출 시 대표자명, 생년월일, 사업의 종류, 세무서명 및 세무서날인을 제외한 정보는 가린 후 제출해 주세요.
              </li>
            </ul>
          </div>
        </div>
        <div style={{ marginBottom: "32px" }}>
          <h2 className="label1" style={{ color: "var(--color-white)", marginBottom: "8px" }}>사업자등록증 업로드</h2>
          <p className="caption2" style={{ color: "var(--color-grey-450)", marginBottom: "16px" }}>
            업로드 후 48시간 내로 관리자가 확인할 예정입니다.
          </p>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          {imageUrl ? (
            <div style={{ width: "101px", height: "101px", borderRadius: "8px", position: "relative", overflow: "hidden" }}>
              <img src={imageUrl} alt="사업자등록증" className="w-full h-full object-cover" />
              {status !== "VERIFIED" && (
                <button onClick={handleDeleteImage} style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "var(--color-grey-750)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
                  <X size={12} color="var(--color-white)" />
                </button>
              )}
            </div>
          ) : (
            <button
              className="label1 flex w-full items-center justify-center rounded-lg py-4"
              style={{ background: "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)", color: "var(--color-white)", fontWeight: "var(--font-weight-semibold)", cursor: "pointer" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={20} style={{ marginRight: "8px" }} />
              사업자등록증 업로드
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-sm items-center justify-around py-3"
        style={{
          backgroundColor: "var(--color-black)",
          borderTop: "1px solid var(--color-grey-850)",
        }}
      >
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}>
          <Calendar size={24} /> 예약
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}>
          <User size={24} /> 고객
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}>
          <MessageSquare size={24} /> 채팅
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-light-purple)" }}>
          <Home size={24} /> 매장
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}>
          <MoreHorizontal size={24} /> 더보기
        </button>
      </nav>
    </div>
  );
};

export default OwnerBusinessRegistrationPage;

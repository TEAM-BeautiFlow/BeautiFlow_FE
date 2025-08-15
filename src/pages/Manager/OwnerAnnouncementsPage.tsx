import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  Plus,
  ShieldAlert,
  Check,
} from "lucide-react";
import api from "@/apis/axiosInstance"; // 🔽 1. api 인스턴스를 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// --- 타입 정의 ---
interface ShopInfo {
  shopName: string;
  introduction: string;
  mainImageUrl?: string;
  verificationStatus?: "NONE" | "PENDING" | "VERIFIED";
}

interface Notice {
  id: number;
  title: string;
  content: string;
}

const OwnerAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  // --- 상태 관리 ---
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔽 2. 컴포넌트 마운트 시 매장 정보와 공지사항 목록을 불러옵니다.
  useEffect(() => {
    const fetchData = async () => {
      if (!shopId) {
        setError("잘못된 접근입니다.");
        setIsLoading(false);
        return;
      }
      try {
        const [shopInfoResponse, noticesResponse] = await Promise.allSettled([
          api.get(`/shops/manage/${shopId}`),
          api.get(`/shops/${shopId}/notices`),
        ]);

        // 매장 정보 처리
        if (shopInfoResponse.status === "fulfilled" && shopInfoResponse.value.data?.data) {
          const data = shopInfoResponse.value.data.data;
          setShopInfo({
            shopName: data.shopName,
            introduction: data.introduction,
            mainImageUrl: data.shopImages?.[0]?.imageUrl,
            verificationStatus: data.verificationStatus, // API 응답에 이 필드가 있다고 가정
          });
        } else {
          console.error("매장 정보 로딩 실패:", shopInfoResponse.status === 'rejected' && shopInfoResponse.reason);
        }

        // 공지사항 목록 처리
        if (noticesResponse.status === "fulfilled" && noticesResponse.value.data?.data) {
          const mappedNotices = noticesResponse.value.data.data.map((item: any) => ({
            id: item.noticeId,
            title: item.title,
            content: item.content,
          }));
          setNotices(mappedNotices);
        } else {
           console.error("공지사항 로딩 실패:", noticesResponse.status === 'rejected' && noticesResponse.reason);
        }

      } catch (err) {
        console.error("데이터 로딩 중 에러 발생:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shopId]);
  
  // 🔽 3. 페이지 이동 핸들러
  const navigateTo = (path: string) => () => navigate(path);

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

      <header className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "var(--color-black)" }}>
        <span className="h1" style={{ color: "var(--color-purple)" }}>BEAUTIFLOW</span>
      </header>
      
      {shopInfo && (
        <>
          <div className="flex space-x-3 px-5 py-4" style={{ backgroundColor: "var(--color-black)" }}>
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-grey-350)" }}>
              {shopInfo.mainImageUrl ? (
                <img src={shopInfo.mainImageUrl} alt="매장 대표 이미지" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "20px 20px" }}></div>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center">
                <h2 className="title1" style={{ color: "var(--color-white)", marginRight: "8px" }}>{shopInfo.shopName}</h2>
                {shopInfo.verificationStatus === 'VERIFIED' && <Check size={20} style={{ color: "var(--color-light-purple)" }} />}
              </div>
              <p className="caption2 truncate" style={{ color: "var(--color-grey-450)", lineHeight: "1.5", marginTop: "4px" }}>
                {shopInfo.introduction || "한 줄 소개가 없습니다."}
              </p>
            </div>
          </div>

          {shopInfo.verificationStatus !== 'VERIFIED' && (
            <button
              className="flex w-full cursor-pointer items-center justify-between px-5 py-4 mb-6"
              style={{ backgroundColor: "var(--color-status-dark-red)", color: "var(--color-status-red)" }}
              onClick={navigateTo(`/owner/business-registration/${shopId}`)}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} />
                <span className="label1">사업자등록증 인증 필요</span>
              </div>
              <ChevronRight size={20} />
            </button>
          )}
        </>
      )}

      <div className="flex border-b px-5" style={{ borderColor: "var(--color-grey-850)", backgroundColor: "var(--color-black)" }}>
        <button onClick={navigateTo(`/owner/verification/${shopId}`)} className="label1 px-2 py-3" style={{ color: "var(--color-grey-450)", fontWeight: "var(--font-weight-medium)" }}>기본</button>
        <button onClick={navigateTo(`/owner/verification/${shopId}`)} className="label1 px-2 py-3" style={{ color: "var(--color-grey-450)", fontWeight: "var(--font-weight-medium)" }}>시술</button>
        <button className="label1 border-b-2 px-2 py-3" style={{ borderColor: "var(--color-white)", color: "var(--color-white)", fontWeight: "var(--font-weight-semibold)" }}>공지사항</button>
      </div>

      <section className="flex-1 overflow-y-auto px-5 py-4 pb-20" style={{ backgroundColor: "var(--color-black)" }}>
        {notices.length > 0 ? (
          notices.map(notice => (
            <div
              key={notice.id}
              onClick={navigateTo(`/owner/announcements/edit/${shopId}/${notice.id}`)}
              className="cursor-pointer rounded-lg p-4 mb-4"
              style={{ backgroundColor: "var(--color-grey-1000)" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="label1 truncate" style={{ color: "var(--color-white)" }}>{notice.title}</h3>
                <ChevronRight size={20} style={{ color: "var(--color-grey-450)", flexShrink: 0 }} />
              </div>
              <p className="body2 line-clamp-2" style={{ color: "var(--color-grey-450)", lineHeight: "1.5" }}>
                {notice.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10" style={{ color: "var(--color-grey-450)" }}>
            등록된 공지사항이 없습니다.
          </div>
        )}
      </section>

      <button
        className="fixed right-5 bottom-24 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-purple)", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", zIndex: 1000 }}
        onClick={navigateTo(`/owner/announcements/add/${shopId}`)}
      >
        <Plus size={32} style={{ color: "var(--color-white)" }} />
      </button>

      <nav className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-sm items-center justify-around py-3" style={{ backgroundColor: "var(--color-black)", borderTop: "1px solid var(--color-grey-850)" }}>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}><Calendar size={24} /> 예약</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}><User size={24} /> 고객</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}><MessageSquare size={24} /> 채팅</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-light-purple)" }}><Home size={24} /> 매장</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: "var(--color-grey-450)" }}><MoreHorizontal size={24} /> 더보기</button>
      </nav>
    </div>
  );
};

export default OwnerAnnouncementsPage;

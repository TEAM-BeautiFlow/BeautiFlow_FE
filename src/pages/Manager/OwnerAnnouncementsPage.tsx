import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  ShieldAlert,
  Check,
  X,
} from "lucide-react";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "@/layout/ManagerNavbar";
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
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null); // 🔽 추가: 선택된 공지사항

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
            verificationStatus: data.verificationStatus,
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
  
  const navigateTo = (path: string) => () => navigate(path);

  // 🔽 추가: 공지사항 클릭 핸들러
  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
  };

  // 🔽 추가: 모달 닫기 핸들러
  const closeModal = () => {
    setSelectedNotice(null);
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

      <section className="flex-1 overflow-y-auto px-5 py-4 pb-28" style={{ backgroundColor: "var(--color-black)" }}>
        {notices.length > 0 ? (
          notices.map(notice => (
            <div
              key={notice.id}
              onClick={() => handleNoticeClick(notice)} // 🔽 수정: 모달을 여는 함수로 변경
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
        className="fixed right-5 bottom-[100px] flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-purple)", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", zIndex: 1000 }}
        onClick={navigateTo(`/owner/announcements/add/${shopId}`)}
      >
        <Plus size={32} style={{ color: "var(--color-white)" }} />
      </button>

      {/* 🔽 추가: 공지사항 상세 모달 */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={closeModal}
        >
          <div 
            className="w-full max-w-md rounded-lg p-6 relative max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "var(--color-grey-900)" }}
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 모달이 닫히지 않도록
          >
            <button
              className="absolute top-4 right-4 p-1"
              onClick={closeModal}
              style={{ color: "var(--color-grey-450)" }}
            >
              <X size={24} />
            </button>
            
            <h2 className="title2 mb-4 pr-8" style={{ color: "var(--color-white)" }}>
              {selectedNotice.title}
            </h2>
            
            <div className="body1" style={{ color: "var(--color-white)", lineHeight: "1.6" }}>
              {selectedNotice.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
            
            <div className="flex justify-end mt-6 pt-4 gap-2" style={{ borderTop: "1px solid var(--color-grey-850)" }}>
              <button
                className="px-4 py-2 rounded-md label1"
                style={{ backgroundColor: "var(--color-grey-800)", color: "var(--color-grey-450)" }}
                onClick={closeModal}
              >
                닫기
              </button>
              <button
                className="px-4 py-2 rounded-md label1"
                style={{ backgroundColor: "var(--color-purple)", color: "var(--color-white)" }}
                onClick={() => {
                  closeModal();
                  navigate(`/owner/announcements/edit/${shopId}/${selectedNotice.id}`);
                }}
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}

      <ManagerNavbar />
    </div>
  );
};

export default OwnerAnnouncementsPage;
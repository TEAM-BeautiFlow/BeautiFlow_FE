import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import api from "@/apis/axiosInstance"; // 🔽 1. api 인스턴스를 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

const OwnerEditAnnouncementPage = () => {
  const navigate = useNavigate();
  // 🔽 2. shopId와 noticeId를 URL 파라미터에서 가져옵니다.
  const { shopId, noticeId } = useParams();

  // --- 상태 관리 ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_LENGTH_TITLE = 50;
  const MAX_LENGTH_CONTENT = 500;
  const isEditing = !!noticeId; // noticeId 유무로 수정 모드인지 생성 모드인지 판단

  // 🔽 3. 수정 모드일 경우, 기존 공지사항 데이터를 불러옵니다.
  useEffect(() => {
    if (isEditing) {
      const fetchNoticeData = async () => {
        if (!shopId || !noticeId) {
          setError("잘못된 접근입니다.");
          setIsLoading(false);
          return;
        }
        try {
          // GET 요청 시에는 /shops/{shopId}/notices/{noticeId} 엔드포인트를 사용할 것으로 가정합니다.
          const response = await api.get(`/shops/${shopId}/notices/${noticeId}`);
          if (response.data && response.data.data) {
            const { title, content } = response.data.data;
            setTitle(title || "");
            setContent(content || "");
          }
        } catch (err) {
          console.error("공지사항 정보 로딩 실패:", err);
          setError("공지사항을 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchNoticeData();
    } else {
      // 생성 모드에서는 데이터를 불러올 필요가 없으므로 로딩 상태를 바로 해제합니다.
      setIsLoading(false);
    }
  }, [shopId, noticeId, isEditing]);

  // 🔽 4. 저장 핸들러에 API 연동 로직을 구현합니다.
  const handleSave = async () => {
    if (!shopId) {
      alert("매장 정보가 없어 저장할 수 없습니다.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert("제목과 본문을 모두 입력해주세요.");
      return;
    }

    const payload = { title, content };

    try {
      if (isEditing) {
        // 수정 모드: PATCH 요청
        await api.patch(`/shops/manage/${shopId}/notices/${noticeId}`, payload);
        alert("공지사항이 성공적으로 수정되었습니다.");
      } else {
        // 생성 모드: POST 요청
        await api.post(`/shops/manage/${shopId}/notices`, payload);
        alert("공지사항이 성공적으로 등록되었습니다.");
      }
      navigate(-1); // 저장 후 이전 페이지로 이동
    } catch (err) {
      console.error("공지사항 저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
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
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px 24px",
          marginTop: "8px",
        }}
      >
        <button onClick={() => navigate(-1)} className="p-0 bg-transparent border-none cursor-pointer">
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1 className="title1" style={{ color: "var(--color-white)", margin: 0 }}>
          {isEditing ? "공지사항 수정" : "공지사항 등록"}
        </h1>
        <button
          className="label1"
          style={{
            color: "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {/* 제목 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="title" className="label1" style={{ color: "var(--color-white)", marginBottom: "8px", display: "block" }}>
            제목 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="title"
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={MAX_LENGTH_TITLE}
              style={{
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontSize: "14px",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
              }}
            />
            <span className="caption2" style={{ position: "absolute", bottom: "12px", right: "16px", color: "var(--color-grey-450)" }}>
              {title.length}/{MAX_LENGTH_TITLE}
            </span>
          </div>
        </div>
        {/* 본문 입력 필드 */}
        <div style={{ marginBottom: "32px" }}>
          <label htmlFor="content" className="label1" style={{ color: "var(--color-white)", marginBottom: "8px", display: "block" }}>
            본문 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              id="content"
              placeholder="공지 사항 본문을 작성해주세요"
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={MAX_LENGTH_CONTENT}
              rows={10}
              style={{
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontSize: "14px",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
                resize: "none",
              }}
            />
            <span className="caption2" style={{ position: "absolute", bottom: "12px", right: "16px", color: "var(--color-grey-450)" }}>
              {content.length}/{MAX_LENGTH_CONTENT}
            </span>
          </div>
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

export default OwnerEditAnnouncementPage;

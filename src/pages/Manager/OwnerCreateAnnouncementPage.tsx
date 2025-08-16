import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "@/layout/ManagerNavbar";
import "../../styles/color-system.css";
import "../../styles/type-system.css";

const OwnerCreateAnnouncementPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  // --- 상태 관리 ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAX_LENGTH_TITLE = 50;
  const MAX_LENGTH_CONTENT = 500;

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
      setIsLoading(true);
      await api.post(`/shops/manage/${shopId}/notices`, payload);
      alert("공지사항이 성공적으로 등록되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("공지사항 저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px 24px",
        }}
      >
        <button 
          onClick={() => navigate(-1)} 
          className="p-0 bg-transparent border-none cursor-pointer"
          disabled={isLoading}
        >
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1 className="title1" style={{ color: "var(--color-white)", margin: 0 }}>
          공지사항 등록
        </h1>
        <button
          className="label1"
          style={{
            color: isLoading ? "var(--color-grey-450)" : "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
            background: "none",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 110px" }}>
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
              disabled={isLoading}
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
                opacity: isLoading ? 0.7 : 1,
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
              disabled={isLoading}
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
                opacity: isLoading ? 0.7 : 1,
              }}
            />
            <span className="caption2" style={{ position: "absolute", bottom: "12px", right: "16px", color: "var(--color-grey-450)" }}>
              {content.length}/{MAX_LENGTH_CONTENT}
            </span>
          </div>
        </div>
      </div>

      <ManagerNavbar />
    </div>
  );
};

export default OwnerCreateAnnouncementPage;
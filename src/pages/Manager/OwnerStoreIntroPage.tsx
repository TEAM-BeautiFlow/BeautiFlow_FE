import { useState } from "react";
import {
  ChevronLeft,
  X,
  Plus,
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import "../../styles/color-system.css"; // 색상 시스템 임포트
import "../../styles/type-system.css"; // 타입 시스템 임포트

const OwnerStoreIntroPage = () => {
  const [introText, setIntroText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // 업로드된 이미지 URL 또는 플레이스홀더

  const MAX_LENGTH_INTRO = 50; // Figma에 0/50으로 표시됨
  const MAX_IMAGES = 5; // 최대 이미지 개수

  const handleSave = () => {
    console.log("매장 소개 저장:", { introText, selectedImages });
    // 여기에 실제 저장 로직 (API 호출 등)을 구현합니다.
  };

  const handleImageUpload = () => {
    // 실제 이미지 업로드 로직 (예: input[type="file"] 트리거)
    if (selectedImages.length < MAX_IMAGES) {
      // 임시로 플레이스홀더 이미지 추가
      setSelectedImages([
        ...selectedImages,
        `placeholder_${selectedImages.length + 1}.png` as never,
      ]);
    }
    console.log("이미지 업로드");
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif", // Pretendard 폰트 적용
      }}
    >
      {/* Status Bar */}
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
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
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

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px 24px", // Figma에 맞춰 패딩 조정
          marginTop: "8px", // Figma에 맞춰 마진 조정
        }}
      >
        <ChevronLeft size={24} color="var(--color-white)" />
        <h1
          className="title1"
          style={{ color: "var(--color-white)", margin: 0 }}
        >
          매장 소개
        </h1>
        <button
          className="label1"
          style={{
            color: "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {" "}
        {/* Figma에 맞춰 패딩 조정 */}
        {/* 한 줄 소개 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="introText"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            한 줄 소개
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              id="introText"
              placeholder="한 줄 소개를 입력해주세요"
              value={introText}
              onChange={e => setIntroText(e.target.value)}
              maxLength={MAX_LENGTH_INTRO}
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
                resize: "none", // 사용자가 크기 조절 못하게
              }}
            />
            <span
              className="caption2"
              style={{
                position: "absolute",
                bottom: "12px",
                right: "16px",
                color: "var(--color-grey-450)",
              }}
            >
              {introText.length}/{MAX_LENGTH_INTRO}
            </span>
          </div>
        </div>
        {/* 대표 사진 업로드 섹션 */}
        <div style={{ marginBottom: "32px" }}>
          <label
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            대표 사진
          </label>
          <p
            className="caption2"
            style={{ color: "var(--color-grey-450)", marginBottom: "16px" }}
          >
            고객이 매장 페이지 진입 시 적용된 사진으로 보이는 이미지예요. <br />
            (권장 규격 16:9, 000MB 이하)
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {/* 업로드된 이미지 플레이스홀더 */}
            {selectedImages.map((_, index) => (
              <div
                key={index}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "var(--color-grey-350)", // 이미지 플레이스홀더 배경색
                }}
              >
                <div
                  style={{
                    // 격자무늬 패턴
                    position: "absolute",
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "20px 20px",
                  }}
                ></div>
                <button
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-grey-750)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10, // 버튼이 이미지 위에 오도록 z-index 추가
                  }}
                >
                  <X size={12} color="var(--color-white)" />
                </button>
              </div>
            ))}

            {/* 이미지 추가 버튼 */}
            {selectedImages.length < MAX_IMAGES && (
              <button
                onClick={handleImageUpload}
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "var(--color-grey-850)",
                  borderRadius: "8px",
                  border: "1px solid var(--color-grey-750)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  gap: "4px",
                }}
              >
                <Plus size={20} color="var(--color-grey-450)" />
                <span
                  className="caption2"
                  style={{ color: "var(--color-grey-450)" }}
                >
                  사진 {selectedImages.length}/{MAX_IMAGES}
                </span>
              </button>
            )}
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
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <Calendar size={24} />
          예약
        </button>
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <User size={24} />
          고객
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
          <Home size={24} />
          매장
        </button>
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <MoreHorizontal size={24} />
          더보기
        </button>
      </nav>
    </div>
  );
};

export default OwnerStoreIntroPage;

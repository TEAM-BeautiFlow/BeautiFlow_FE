import { useState } from "react";
import { ChevronLeft, X, Plus, ChevronRight } from "lucide-react";

const AppointmentBooking = () => {
  // 선택된 이미지 상태 (초기 2개 플레이스홀더)
  const [selectedImages, setSelectedImages] = useState([
    "placeholder1.png", // 실제 이미지 URL 대신 플레이스홀더 문자열 사용
    "placeholder2.png",
  ]);
  // 요청사항 텍스트 상태
  const [description, setDescription] =
    useState("최대한 빨리 시술 부탁드립니다."); // Figma에 있는 초기 텍스트 설정

  // 이미지 업로드 핸들러 (현재는 콘솔 로그만)
  const handleImageUpload = () => {
    console.log("이미지 업로드 로직 실행");
    // 실제 이미지 업로드 로직 (예: input[type="file"] 트리거)
    // setSelectedImages([...selectedImages, '새로운_이미지_URL']);
  };

  // 이미지 삭제 핸들러
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
          시술 예약하기
        </h1>
        <X size={24} color="var(--color-white)" />
      </div>

      {/* 시술 정보 섹션 */}
      <div style={{ padding: "0 20px 32px" }}>
        {" "}
        {/* Figma에 맞춰 패딩 조정 */}
        <h2
          className="label1"
          style={{ color: "var(--color-white)", marginBottom: "16px" }}
        >
          시술 정보
        </h2>{" "}
        {/* Figma에 맞춰 폰트 및 마진 조정 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--color-grey-850)",
          }}
        >
          {/* 이미지 플레이스홀더 */}
          <div
            style={{
              width: "101px",
              height: "101px",
              borderRadius: "8px",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "var(--color-grey-350)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.1,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              className="label1"
              style={{
                color: "var(--color-white)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              이달의 아트 (9월)
            </div>{" "}
            {/* 폰트 및 색상 조정 */}
            <div
              className="label1"
              style={{
                color: "var(--color-white)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              34,000원
            </div>{" "}
            {/* 폰트 및 색상 조정 */}
          </div>
          <ChevronRight size={20} color="var(--color-grey-450)" />{" "}
          {/* 오른쪽 화살표 아이콘 */}
        </div>
      </div>

      {/* 요청사항 섹션 */}
      <div style={{ padding: "0 20px 32px" }}>
        <h2
          className="label1"
          style={{ color: "var(--color-white)", marginBottom: "8px" }}
        >
          요청사항
        </h2>
        <p
          className="body2"
          style={{ color: "var(--color-grey-450)", marginBottom: "16px" }}
        >
          요청사항이나 레퍼런스를 공유해주세요. (optional)
        </p>

        {/* 이미지 업로드 섹션 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
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
          {selectedImages.length < 5 && ( // 최대 5개 이미지 제한 (예시)
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
                사진 {selectedImages.length}/5
              </span>
            </button>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div style={{ position: "relative" }}>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="최대한 빨리 시술 부탁드립니다."
            maxLength={100} // 최대 글자 수 100자
            style={{
              width: "100%",
              height: "100px",
              backgroundColor: "var(--color-grey-850)", // Figma 배경색
              border: "1px solid var(--color-grey-750)", // Figma 테두리 색상
              borderRadius: "8px",
              padding: "16px",
              color: "var(--color-white)",
              fontSize: "14px",
              fontFamily: "Pretendard, sans-serif",
              resize: "none",
              outline: "none",
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
            {description.length}/100
          </span>
        </div>
      </div>

      {/* Bottom Button */}
      <div style={{ padding: "0 20px 40px" }}>
        {" "}
        {/* Figma에 맞춰 패딩 조정 */}
        <button
          style={{
            width: "100%",
            height: "56px",
            background:
              "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)", // Figma 그라데이션
            border: "none",
            borderRadius: "8px",
            color: "var(--color-white)",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Pretendard, sans-serif",
            cursor: "pointer",
          }}
        >
          다음으로
        </button>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
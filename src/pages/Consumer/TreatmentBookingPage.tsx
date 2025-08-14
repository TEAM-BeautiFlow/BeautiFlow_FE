import { useState } from "react";
import { ChevronLeft, X, Check } from "lucide-react";
import "../../styles/color-system.css"; // 색상 시스템 임포트
import "../../styles/type-system.css"; // 타입 시스템 임포트

const TreatmentBookingPage = () => {
  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState({
    all: false,
    privacy: false, // [필수] 개인정보 제3자 제공 동의
    terms: false, // [필수] 이용약관 동의
  });

  // 약관 체크박스 변경 핸들러
  const handleAgreementChange = (key: "all" | "privacy" | "terms") => {
    if (key === "all") {
      const newAllState = !agreements.all;
      setAgreements({
        all: newAllState,
        privacy: newAllState,
        terms: newAllState,
      });
    } else {
      const newAgreements = {
        ...agreements,
        [key]: !agreements[key],
      };

      // 모든 개별 약관이 체크되면 '모두 동의합니다'도 체크
      newAgreements.all = newAgreements.privacy && newAgreements.terms;

      setAgreements(newAgreements);
    }
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

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {" "}
        {/* Figma에 맞춰 패딩 조정 */}
        {/* 예약 정보 섹션 */}
        <div style={{ marginBottom: "32px" }}>
          {" "}
          {/* Figma에 맞춰 마진 조정 */}
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            예약 정보
          </h2>
          <div
            style={{
              backgroundColor: "var(--color-grey-1000)", // Figma 배경색 #1A1A1A
              borderRadius: "8px",
              overflow: "hidden", // border-radius 적용을 위해
            }}
          >
            {/* 각 정보 행 */}
            {[
              { label: "예약자명", value: "손하늘" },
              { label: "시술일시", value: "2025.07.02 13:00" },
              { label: "소요시간", value: "1시간 30분" },
              { label: "매장이름", value: "뷰티플로우" },
              { label: "시술자명", value: "손영이 원장" },
              { label: "시술내역", value: "이달의 아트 외 1개" },
            ].map((item, index) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  borderBottom:
                    index === 5 ? "none" : "1px solid var(--color-grey-850)", // 마지막 줄은 border 없음
                }}
              >
                <div
                  className="body2"
                  style={{
                    width: "80px", // Figma에 맞춰 너비 고정
                    padding: "12px",
                    color: "var(--color-grey-450)",
                    backgroundColor: "var(--color-grey-950)", // Figma 배경색 #262626
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="body2"
                  style={{
                    flex: 1,
                    padding: "12px",
                    color: "var(--color-white)",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 유의사항 섹션 */}
        <div style={{ marginBottom: "32px" }}>
          {" "}
          {/* Figma에 맞춰 마진 조정 */}
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            유의사항
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              className="body2"
              style={{
                color: "var(--color-grey-450)",
                lineHeight: "1.5",
                marginBottom: "12px",
                position: "relative",
                paddingLeft: "16px",
              }}
            >
              <span style={{ position: "absolute", left: "0" }}>•</span> 예약을
              신청하면 관리자가 보증금(예약금) 입금 여부와 해당 시간대의 가능
              여부를 확인하고, 예약 상태를 변경해요
            </li>
            <li
              className="body2"
              style={{
                color: "var(--color-grey-450)",
                lineHeight: "1.5",
                marginBottom: "12px",
                position: "relative",
                paddingLeft: "16px",
              }}
            >
              <span style={{ position: "absolute", left: "0" }}>•</span> 예약
              신청은 시술받고자하는 시간 기준 24시간 전까지 가능해요
            </li>
            <li
              className="body2"
              style={{
                color: "var(--color-grey-450)",
                lineHeight: "1.5",
                position: "relative",
                paddingLeft: "16px",
              }}
            >
              <span style={{ position: "absolute", left: "0" }}>•</span> 안내
              사항을 숙지하고 샵에 방문하면 사장님의 안내를 따라주세요
            </li>
          </ul>
        </div>
        {/* 취소 및 환불 안내 섹션 */}
        <div style={{ marginBottom: "32px" }}>
          {" "}
          {/* Figma에 맞춰 마진 조정 */}
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            취소 및 환불 안내
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              className="body2"
              style={{
                color: "var(--color-grey-450)",
                lineHeight: "1.5",
                position: "relative",
                paddingLeft: "16px",
              }}
            >
              <span style={{ position: "absolute", left: "0" }}>•</span> 예약을
              신청하면 관리자가 보증금(예약금) 입금 여부와 해당 시간대의 가능
              여부를 확인하고, 예약 상태를 변경해요
            </li>
          </ul>
        </div>
        {/* 약관 동의 섹션 */}
        <div style={{ marginBottom: "100px" }}>
          {" "}
          {/* 하단 버튼 공간 확보를 위해 마진 조정 */}
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            약관 동의
          </h2>
          {/* 모두 동의합니다 체크박스 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              cursor: "pointer",
            }}
            onClick={() => handleAgreementChange("all")}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px", // Figma에 맞춰 둥근 사각형
                border: `2px solid ${agreements.all ? "var(--color-purple)" : "var(--color-grey-650)"}`,
                backgroundColor: agreements.all
                  ? "var(--color-purple)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
            >
              {agreements.all && <Check size={16} color="var(--color-white)" />}
            </div>
            <span className="body1" style={{ color: "var(--color-white)" }}>
              모두 동의합니다
            </span>
          </div>
          {/* 개별 약관들 */}
          <div
            style={{
              paddingLeft: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {" "}
            {/* Figma에 맞춰 패딩 및 간격 조정 */}
            {/* 개인정보 제3자 제공 동의 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => handleAgreementChange("privacy")}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  border: `2px solid ${agreements.privacy ? "var(--color-purple)" : "var(--color-grey-650)"}`,
                  backgroundColor: agreements.privacy
                    ? "var(--color-purple)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                {agreements.privacy && (
                  <Check size={16} color="var(--color-white)" />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="body2" style={{ color: "var(--color-white)" }}>
                  [필수] 개인정보 제3자 제공 동의
                </span>
                <span
                  className="caption2"
                  style={{ color: "var(--color-grey-450)" }}
                >
                  보기
                </span>
              </div>
            </div>
            {/* 이용약관 동의 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => handleAgreementChange("terms")}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  border: `2px solid ${agreements.terms ? "var(--color-purple)" : "var(--color-grey-650)"}`,
                  backgroundColor: agreements.terms
                    ? "var(--color-purple)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                {agreements.terms && (
                  <Check size={16} color="var(--color-white)" />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="body2" style={{ color: "var(--color-white)" }}>
                  [필수] 이용약관 동의
                </span>
                <span
                  className="caption2"
                  style={{ color: "var(--color-grey-450)" }}
                >
                  보기
                </span>
              </div>
            </div>
          </div>
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
          결제 정보 확인하기
        </button>
      </div>
    </div>
  );
};

export default TreatmentBookingPage;

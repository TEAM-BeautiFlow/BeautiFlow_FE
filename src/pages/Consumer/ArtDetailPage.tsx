import { useState } from "react";
import { ChevronLeft, Clock } from "lucide-react";

const ArtDetailPage = () => {
  // 모달 표시 상태를 관리하는 state
  const [isModalOpen, setIsModalOpen] = useState(false); // 초기 상태를 false로 설정

  // 모달 열기 핸들러
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // '카카오 로그인' 버튼 클릭 핸들러
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭");
    // 여기에 실제 카카오 로그인 로직을 구현합니다.
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
      }}
    >
      {/* Status Bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="h-1 w-1 rounded-full bg-white"></div>
            <div className="h-1 w-1 rounded-full bg-white"></div>
            <div className="h-1 w-1 rounded-full bg-white"></div>
            <div className="h-1 w-1 rounded-full bg-white"></div>
          </div>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L5.8 12l-.65-1.05zM7.2 12l-.65 1.05L7.4 14.5l.85-1.48L7.2 12zm2.8 0l-.65 1.05L10.2 14.5l.85-1.48L10 12zm2.8 0l-.65 1.05L12.8 14.5l.85-1.48L12.8 12zm2.8 0l-.65 1.05L15.6 14.5l.85-1.48L15.6 12zm2.8 0l-.65 1.05L18.4 14.5l.85-1.48L18.4 12z" />
          </svg>
          <div className="h-3 w-6 rounded-sm border border-white">
            <div className="h-full w-full rounded-sm bg-white"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        <ChevronLeft
          className="h-6 w-6"
          style={{ color: "var(--color-white)" }}
        />
      </div>

      {/* Image Placeholder */}
      <div
        className="relative h-96 overflow-hidden"
        style={{ backgroundColor: "var(--color-grey-350)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="body1" style={{ color: "var(--color-grey-650)" }}>
            배너 이미지
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 px-5 py-4"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        {/* 시술 제목 */}
        <h1
          className="title1"
          style={{ color: "var(--color-white)", marginBottom: "8px" }}
        >
          하반기 BEST 인기 네일 (랜덤)
        </h1>

        {/* 가격 및 소요시간 */}
        <div className="mb-6 flex items-center justify-between">
          <span className="label1" style={{ color: "var(--color-purple)" }}>
            47,000원
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
              60분
            </span>
          </div>
        </div>

        {/* 시술 정보 */}
        <div className="mb-8">
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            시술 정보
          </h2>

          <div
            className="body2 space-y-4"
            style={{ color: "var(--color-grey-450)", lineHeight: "1.5" }}
          >
            <p>
              9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어
              주세요! 9월 이달의 아트입니다. 9월 이달의 아트입니다. 9월 이달의
              아트입니다.
            </p>

            <p>
              9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어
              주세요! 9월 이달의 아트입니다. 9월 이달의 아트입니다. 9월 이달의
              아트입니다.
            </p>

            <p>
              9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어
              주세요! 9월 이달의 아트입니다. 9월 이달의 아트입니다. 9월 이달의
              아트입니다.
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mx-auto w-full max-w-sm px-2 py-4">
          <button
            className="label1 w-full rounded-lg py-4"
            style={{
              background:
                "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)",
              color: "var(--color-white)",
              fontWeight: "var(--font-weight-semibold)",
            }}
            onClick={handleModalOpen} // 버튼 클릭 시 모달 열기 함수 호출
          >
            예약하기
          </button>
        </div>
      </div>

      {/* 카카오톡 로그인 모달 */}
      {isModalOpen && (
        <div
          className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity"
          onClick={handleModalClose} // 모달 외부 클릭 시 닫기
        >
          <div
            className="w-full max-w-xs rounded-lg p-6 shadow-lg"
            style={{ backgroundColor: "var(--color-grey-850)" }}
            onClick={e => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
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

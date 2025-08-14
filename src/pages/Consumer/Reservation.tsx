import { useState } from "react";
import { MessageSquare, Clock, Home, Calendar, User, X } from "lucide-react";

// ReservationProps 타입 정의 (현재는 비어있지만, 필요시 확장 가능)
const Reservation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState({
    title: "",
    content: "",
  });

  // 공지사항 목록 (임시 데이터)
  const announcements = [
    {
      id: 1,
      title: "공지사항 제목입니다",
      content:
        "공지 사항을 읽고 예약해주세요. 최대 2줄까지 보입니다. 나머지는 더보기를 통해 확인할 수 있습니다. 디자인은...",
    },
    {
      id: 2,
      title: "휴무일 안내",
      content: "8월 15일은 광복절로 휴무입니다. 예약 시 참고 부탁드립니다.",
    },
  ];

  const handleAnnouncementClick = (announcement: {
    title: string;
    content: string;
  }) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    // 전체 화면 컨테이너: Figma 디자인의 배경색인 검정색 (#0C0D11) 적용
    // min-h-screen을 사용하여 최소 높이를 화면 전체로 설정
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--color-white)" }}
    >
      {/* 모달이 열리면 배경에 blur 효과 적용 */}
      <div
        className="transition-filter w-full max-w-sm"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
          filter: isModalOpen ? "blur(4px)" : "none", // 모달이 열리면 blur 효과 적용
        }}
      >
        {/* 상단 상태 바 (Status Bar) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px", // Figma에 맞게 padding 조정 (상하 12px, 좌우 20px)
            fontSize: "16px", // Figma 폰트 사이즈
            fontWeight: "600", // Figma 폰트 두께
            backgroundColor: "var(--color-black)",
            color: "var(--color-white)",
          }}
        >
          <span>9:41</span> {/* 시간 */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Wi-Fi 신호 아이콘 (Figma 디자인과 유사하게 SVG로 표현) */}
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
            {/* 배터리 아이콘 (Figma 디자인과 유사하게 SVG로 표현) */}
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

        {/* 메인 헤더 (BEAUTIFLOW 로고) */}
        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          <span className="h1" style={{ color: "var(--color-purple)" }}>
            BEAUTIFLOW
          </span>
        </header>

        {/* 배너 이미지 플레이스홀더 (Figma의 투명한 격자무늬 패턴 재현) */}
        <div
          className="relative h-64 w-full overflow-hidden"
          style={{ backgroundColor: "var(--color-grey-350)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }}
          ></div>
          {/* 플레이스홀더 텍스트 색상 및 폰트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="body1" style={{ color: "var(--color-grey-650)" }}>
              배너 이미지
            </span>
          </div>
        </div>

        {/* 샵 정보 섹션 */}
        <section
          className="px-5 py-4"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          {/* '뷰티플로우' 제목과 '채팅' 버튼 (Figma에 맞춰 재배치) */}
          <div className="mb-1 flex items-center justify-between">
            <h2 className="title1" style={{ color: "var(--color-white)" }}>
              뷰티플로우
            </h2>
            {/* '채팅' 버튼만 남김 */}
            <button className="flex items-center gap-1">
              {" "}
              {/* '채팅' 아이콘과 텍스트 버튼 */}
              <MessageSquare size={20} color="var(--color-grey-450)" />{" "}
              {/* Figma에 보이는 색상으로 변경 */}
              <span
                className="caption1"
                style={{ color: "var(--color-grey-450)" }}
              >
                채팅
              </span>{" "}
              {/* Figma에 보이는 폰트와 색상으로 변경 */}
            </button>
          </div>
          {/* 샵 한 줄 소개와 '더보기' 버튼 (Figma에 맞춰 재배치) */}
          {/* '더보기' 버튼을 '말 줄임표...' 옆으로 이동하기 위해 p 태그 내부에 포함 */}
          <p className="body2" style={{ color: "var(--color-grey-450)" }}>
            네일샵 한 줄 소개입니다. 한 줄 소개는 254px * 42px을 넘어가지 않고,
            이후는 말 줄임표...
            <button
              className="body2 ml-1 inline-block"
              style={{ color: "var(--color-grey-450)" }}
            >
              더보기
            </button>{" "}
            {/* inline-block으로 인라인 요소처럼 취급, ml-1로 미세 간격 조정 */}
          </p>

          {/* 공지사항 태그들: 배경색 #262626 (var(--color-grey-950)) 적용, 글씨 색깔 Figma에 맞춰 변경 */}
          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-2">
            {/* 공지사항 목록을 렌더링하고 클릭 시 모달을 열도록 수정 */}
            {announcements.map(announcement => (
              <div
                key={announcement.id}
                className="flex-shrink-0 cursor-pointer rounded-md p-3"
                style={{
                  backgroundColor: "var(--color-grey-950)",
                  width: "160px",
                }}
                onClick={() => handleAnnouncementClick(announcement)} // 클릭 시 모달 열기
              >
                <h4
                  className="caption1"
                  style={{ color: "var(--color-white)", marginBottom: "4px" }}
                >
                  {announcement.title}
                </h4>
                <p
                  className="caption2"
                  style={{
                    color: "var(--color-grey-450)",
                    lineHeight: "1.5",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {" "}
                  {/* 2줄까지만 보이도록 처리 */}
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 탭 네비게이션: 시술 / 정보 */}
        <div
          className="flex border-b px-5"
          style={{
            borderColor: "var(--color-grey-850)",
            backgroundColor: "var(--color-black)",
          }}
        >
          <button
            className="label1 px-2 py-3"
            style={{
              color: "var(--color-white)",
              fontWeight: "var(--font-weight-semibold)",
              borderBottom: "2px solid var(--color-white)",
            }}
          >
            시술
          </button>
          <button
            className="label1 px-2 py-3"
            style={{
              color: "var(--color-grey-450)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            정보
          </button>
        </div>

        {/* 탭 내용 영역 */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 pb-20"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          {/* '시술' 탭 내용 */}
          <>
            {/* 카테고리 버튼: 손 / 발 / 기타 */}
            <div
              className="mb-6 flex gap-2"
              style={{ backgroundColor: "var(--color-black)" }}
            >
              {" "}
              {/* mb-6으로 간격 조정 */}
              {/* 현재 시술 카테고리 선택 상태가 없으므로, Figma에 맞춰 '손'을 활성화 상태로 가정 */}
              <button
                className="caption2 rounded-full px-2.5 py-1"
                style={{
                  backgroundColor: "var(--color-dark-purple)",
                  border: "1.5px solid var(--color-light-purple)",
                  color: "#F3F3F3",
                }}
              >
                손
              </button>
              <button
                className="caption2 rounded-full px-2.5 py-1"
                style={{
                  backgroundColor: "var(--color-grey-750)",
                  color: "var(--color-grey-450)",
                }}
              >
                발
              </button>
              <button
                className="caption2 rounded-full px-2.5 py-1"
                style={{
                  backgroundColor: "var(--color-grey-750)",
                  color: "var(--color-grey-450)",
                }}
              >
                기타
              </button>
            </div>

            {/* 시술 리스트 섹션 */}
            <section
              className="flex-1 overflow-y-auto pb-20"
              style={{ backgroundColor: "var(--color-black)" }}
            >
              {[1, 2].map(
                (
                  _,
                  idx, // Figma에 보이는 2개의 아이템만 렌더링
                ) => (
                  <div key={idx} className="mb-6">
                    {" "}
                    {/* 각 시술 아이템 하단 마진 24px */}
                    <div className="flex items-center gap-4">
                      {" "}
                      {/* 이미지와 텍스트 블록 간 간격 16px */}
                      {/* 시술 이미지 플레이스홀더 */}
                      <div
                        className="h-24 w-24 flex-shrink-0 rounded-md"
                        style={{ backgroundColor: "var(--color-grey-350)" }}
                      />
                      {/* 시술 상세 정보 */}
                      <div className="flex-1">
                        {/* 시술 항목 이름 ('이달의 아트')와 소요 시간 ('60분')을 동일 선상에 배치 */}
                        <div className="mb-1 flex items-center justify-between">
                          {" "}
                          {/* gap-1 (4px) */}
                          <span
                            className="label1"
                            style={{ color: "var(--color-white)" }}
                          >
                            이달의 아트
                          </span>{" "}
                          {/* 시술 항목 이름 */}
                          <div className="flex items-center gap-1">
                            <Clock size={16} color="var(--color-grey-450)" />
                            <span
                              className="caption2"
                              style={{ color: "var(--color-grey-450)" }}
                            >
                              60분
                            </span>
                          </div>
                        </div>

                        {/* 가격 정보 */}
                        <div
                          className="label1"
                          style={{
                            color: "var(--color-white)",
                            marginBottom: "8px",
                          }}
                        >
                          34,000원 ~ 47,000원
                        </div>

                        {/* 시술 설명 */}
                        <p
                          className="body2"
                          style={{
                            color: "var(--color-grey-450)",
                            lineHeight: "1.5",
                            margin: 0,
                          }}
                        >
                          9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에
                          적어주세요!
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </section>
          </>
        </div>

        {/* 하단 내비게이션 바 (Fixed Bottom) */}
        <nav
          className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-sm items-center justify-around py-3"
          style={{
            backgroundColor: "var(--color-black)",
            borderTop: "1px solid var(--color-grey-850)",
          }}
        >
          {/* 매장 버튼 */}
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-grey-450)" }}
          >
            <Home size={24} />
            매장
          </button>
          {/* 채팅 버튼 */}
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-grey-450)" }}
          >
            <MessageSquare size={24} />
            채팅
          </button>
          {/* 예약 버튼 (활성화 상태) */}
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-light-purple)" }}
          >
            <Calendar size={24} />
            예약
          </button>
          {/* 마이페이지 버튼 */}
          <button
            className="flex flex-col items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-grey-450)" }}
          >
            <User size={24} />
            마이페이지
          </button>
        </nav>
      </div>

      {/* 공지사항 모달 */}
      {isModalOpen && (
        <div
          className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity"
          onClick={handleModalClose}
        >
          <div
            className="w-full max-w-sm rounded-lg p-6 shadow-lg"
            style={{ backgroundColor: "var(--color-black)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="title1" style={{ color: "var(--color-white)" }}>
                {selectedAnnouncement.title}
              </h2>
              <button onClick={handleModalClose}>
                <X size={24} style={{ color: "var(--color-white)" }} />
              </button>
            </div>
            <p
              className="body2"
              style={{ color: "var(--color-grey-450)", lineHeight: "1.5" }}
            >
              {selectedAnnouncement.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;

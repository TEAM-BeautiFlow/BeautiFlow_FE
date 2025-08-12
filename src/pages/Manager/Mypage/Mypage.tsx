import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import HeartIcon from "../../../assets/line-md_heart.svg";
import InquiryIcon from "../../../assets/message-text-02.svg";
import ChevronRight from "../../../assets/icon_right-chevron.svg";

export default function Mypage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[812px] min-w-[375px] flex-col items-center justify-center">
      <div className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-hidden bg-[var(--color-grey-1000)] px-5 pt-8 pb-6">
        {/* 상단 네비게이션 */}
        <div className="mb-2 flex w-full items-center">
          <div className="flex items-center gap-2">
            <span className="h1 text-left text-[var(--color-white)]">
              이하늘 디자이너님
            </span>
            <img src={ChevronRight} alt=">" className="h-5 w-5" />
          </div>
        </div>
        {/* 부가 설명 */}
        <div className="caption1 mb-6 w-full text-[#A1A1A1]">
          beautiflow@gmail.com
        </div>
        {/* 카드 버튼 2개 */}
        <div className="mb-2 flex w-full">
          <button
            type="button"
            onClick={() => navigate("/manager/mypage/modify")}
            className="flex flex-1 flex-col items-center border-r border-[#232323] py-6 transition-colors hover:bg-[var(--color-grey-900)]"
            aria-label="디자이너 정보 수정"
          >
            <img src={HeartIcon} alt="선호 스타일" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">
              디자이너 정보 수정
            </span>
          </button>
          <div className="flex flex-1 flex-col items-center py-6">
            <img src={InquiryIcon} alt="문의하기" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">문의하기</span>
          </div>
        </div>
        {/* 내계정 */}
        <SectionTitle>내계정</SectionTitle>
        <MenuItem onClick={() => navigate("/manager/mypage/edit")}>
          정보 수정
        </MenuItem>
        <MenuItem>로그아웃</MenuItem>
        {/* 고객센터 */}
        <SectionTitle>고객센터</SectionTitle>
        <MenuItem
          onClick={() =>
            (window.location.href =
              "https://pale-kale-a47.notion.site/24d18d2ded1580068e21ef4e52a2bdc0")
          }
        >
          자주 묻는 질문
        </MenuItem>
        <MenuItem
          onClick={() =>
            (window.location.href =
              "https://pale-kale-a47.notion.site/24d18d2ded1580feb8b0df6e262358e3")
          }
        >
          공지사항
        </MenuItem>
        {/* 약관 */}
        <SectionTitle>약관</SectionTitle>
        <MenuItem>이용약관</MenuItem>
        <MenuItem>개인정보처리방침</MenuItem>
        <SectionTitle>탈퇴하기</SectionTitle>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="body1 mt-8 mb-2 w-full text-left text-[#A1A1A1]">
      {children}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="body1 w-full bg-transparent px-0 py-3 text-left text-[var(--color-white)]"
    >
      {children}
    </button>
  );
}

import React from "react";
import HeartIcon from "../../../assets/line-md_heart.svg";
import InquiryIcon from "../../../assets/message-text-02.svg";
import ChevronRight from "../../../assets/icon_right-chevron.svg";

export default function Mypage() {
  return (
    <div className="flex min-h-[812px] min-w-[375px] flex-col items-center justify-center">
      <div className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-hidden bg-[var(--color-grey-1000)] px-5 pt-8 pb-6">
        {/* 상단 네비게이션 */}
        <div className="mb-2 flex w-full items-center">
          <div className="flex items-center gap-2">
            <span className="h1 text-left text-[var(--color-white)]">
              로그인 및 회원가입
            </span>
            <img src={ChevronRight} alt=">" className="h-5 w-5" />
          </div>
        </div>
        {/* 부가 설명 */}
        <div className="caption1 mb-6 w-full text-[#A1A1A1]">
          3초 가입으로 더 편리해진 뷰티플로우를 경험해보세요
        </div>
        {/* 카드 버튼 2개 */}
        <div className="mb-2 flex w-full">
          <div className="flex flex-1 flex-col items-center border-r border-[#232323] py-6">
            <img src={HeartIcon} alt="선호 스타일" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">선호 스타일</span>
          </div>
          <div className="flex flex-1 flex-col items-center py-6">
            <img src={InquiryIcon} alt="문의하기" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">문의하기</span>
          </div>
        </div>
        {/* 내계정 */}
        <SectionTitle>내계정</SectionTitle>
        <MenuItem>정보 수정</MenuItem>
        <MenuItem>로그아웃</MenuItem>
        <MenuItem>탈퇴하기</MenuItem>
        {/* 고객센터 */}
        <SectionTitle>고객센터</SectionTitle>
        <MenuItem>자주 묻는 질문</MenuItem>
        <MenuItem>공지사항</MenuItem>
        {/* 약관 */}
        <SectionTitle>약관</SectionTitle>
        <MenuItem>이용약관</MenuItem>
        <MenuItem>개인정보처리방침</MenuItem>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="body1 mt-8 mb-2 w-full text-left text-[#A1A1A1]">
      {children}
    </div>
  );
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="body1 w-full bg-transparent px-0 py-3 text-left text-[var(--color-white)]">
      {children}
    </div>
  );
}

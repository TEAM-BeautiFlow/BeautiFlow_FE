import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, logout } from "@/apis/mypage/mypage";
import { useAuthStore } from "@/stores/auth";
import HeartIcon from "../../../assets/line-md_heart.svg";
import InquiryIcon from "../../../assets/message-text-02.svg";
import ChevronRight from "../../../assets/icon_right-chevron.svg";
import Header from "@/layout/Header";

export default function Mypage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore(state => state.clear);
  const { data: user, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
  const { mutate: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: ["userInfo"], exact: true });
      alert("로그아웃되었습니다.");
      navigate("/");
    },
  });
  return (
    <div className="mx-auto flex min-h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      <Header />
      <div className="relative flex w-full flex-col items-center overflow-hidden px-5 pb-24">
        {/* 상단 네비게이션 */}
        <button
          type="button"
          aria-label="정보 수정으로 이동"
          onClick={() =>
            navigate("/manager/mypage/modify", {
              state: {
                name: user?.name ?? "",
                email: user?.email ?? "",
                contact: user?.contact ?? "",
              },
            })
          }
          className="mb-2 flex w-full items-center"
        >
          <div className="flex items-center gap-2">
            <span className="h1 text-left text-[var(--color-white)]">
              {isLoading
                ? "로딩 중"
                : user?.name
                  ? `${user.name} 디자이너님`
                  : "디자이너님"}
            </span>
            <img src={ChevronRight} alt=">" className="h-5 w-5" />
          </div>
        </button>
        {/* 부가 설명 */}
        <div className="caption1 mb-6 w-full text-[#A1A1A1]">
          {isLoading ? "" : (user?.email ?? "")}
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
          <button
            type="button"
            onClick={() =>
              window.open("https://open.kakao.com/o/sEpQVpMh", "_blank")
            }
            className="flex flex-1 flex-col items-center py-6 transition-colors hover:bg-[var(--color-grey-900)]"
            aria-label="문의하기"
          >
            <img src={InquiryIcon} alt="문의하기" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">문의하기</span>
          </button>
        </div>
        {/* 내계정 */}
        <SectionTitle>내계정</SectionTitle>
        <MenuItem
          onClick={() =>
            navigate("/manager/mypage/modify", {
              state: {
                name: user?.name ?? "",
                email: user?.email ?? "",
                contact: user?.contact ?? "",
              },
            })
          }
        >
          정보 수정
        </MenuItem>
        <MenuItem onClick={() => doLogout()}>
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </MenuItem>
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
        <MenuItem onClick={() => navigate("/terms")}>이용약관</MenuItem>
        <MenuItem onClick={() => navigate("/privacy")}>
          개인정보처리방침
        </MenuItem>
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

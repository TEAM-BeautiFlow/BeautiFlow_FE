import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, logout, deleteUser } from "@/apis/mypage/mypage";
import { useAuthStore } from "@/stores/auth";
import { getKakaoAuthUrl } from "@/apis/login";
import HeartIcon from "../../../assets/line-md_heart.svg";
import InquiryIcon from "../../../assets/message-text-02.svg";
import ChevronRight from "../../../assets/icon_right-chevron.svg";
import Header from "../../../layout/Header";

export default function Mypage() {
  const navigate = useNavigate();
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore(state => state.clear);
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    enabled: Boolean(localStorage.getItem("accessToken")),
  });
  const { mutate: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clearAuth();
      setIsLoggedIn(false);
      queryClient.removeQueries({ queryKey: ["userInfo"], exact: true });
      alert("로그아웃되었습니다.");
    },
  });
  const { mutate: doDeleteUser, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: res => {
      clearAuth();
      setIsLoggedIn(false);
      queryClient.removeQueries({ queryKey: ["userInfo"], exact: true });
      alert(res?.message ?? "탈퇴가 완료되었습니다.");
      navigate("/");
    },
    onError: () => {
      alert("탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
  }, []);

  function handleKakaoLogin() {
    try {
      localStorage.setItem("loginProvider", "kakao-customer");
    } catch {}
    const url = getKakaoAuthUrl("customer");
    window.location.href = url;
  }

  return (
    <div className="mx-auto flex min-h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      <Header />
      <div className="relative flex w-full flex-col items-center overflow-hidden px-5 pb-24">
        {/* 상단 네비게이션 */}
        <div
          className="mb-2 flex w-full cursor-pointer items-center"
          role="button"
          tabIndex={0}
          onClick={handleKakaoLogin}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") handleKakaoLogin();
          }}
        >
          <div className="flex items-center gap-2">
            <span className="h1 text-left text-[var(--color-white)]">
              {user?.name ? `${user.name} 님` : "로그인 및 회원가입"}
            </span>
            <img src={ChevronRight} alt=">" className="h-5 w-5" />
          </div>
        </div>
        {/* 부가 설명 / 이메일 */}
        <div className="caption1 mb-6 w-full text-[#A1A1A1]">
          {user?.email ?? "3초 가입으로 더 편리해진 뷰티플로우를 경험해보세요"}
        </div>
        {/* 카드 버튼 2개 */}
        <div className="mb-2 flex w-full">
          <div
            className="flex flex-1 cursor-pointer flex-col items-center border-r border-[#232323] py-6"
            onClick={() => {
              if (!isLoggedIn) setIsLoginRequiredOpen(true);
              else navigate("/client/mypage/style");
            }}
          >
            <img src={HeartIcon} alt="선호 스타일" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">선호 스타일</span>
          </div>
          <button
            type="button"
            className="flex flex-1 flex-col items-center py-6 transition-colors hover:bg-[var(--color-grey-900)]"
            onClick={() =>
              window.open("https://open.kakao.com/o/sEpQVpMh", "_blank")
            }
            aria-label="문의하기"
          >
            <img src={InquiryIcon} alt="문의하기" className="mb-2 h-8 w-8" />
            <span className="body1 text-[var(--color-white)]">문의하기</span>
          </button>
        </div>
        {/* 내계정 */}
        <SectionTitle>내계정</SectionTitle>
        <MenuItem
          disabled={!isLoggedIn}
          onClick={() =>
            navigate("/client/mypage/edit", {
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
        <MenuItem disabled={!isLoggedIn} onClick={() => doLogout()}>
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </MenuItem>
        <MenuItem
          disabled={!isLoggedIn}
          onClick={() => {
            if (isDeleting) return;
            const confirmed = window.confirm(
              "정말로 탈퇴하시겠어요? 모든 정보가 삭제됩니다.",
            );
            if (confirmed) doDeleteUser();
          }}
        >
          {isDeleting ? "탈퇴 처리 중..." : "탈퇴하기"}
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
      </div>
      {isLoginRequiredOpen ? (
        <LoginRequiredModal
          onClose={() => setIsLoginRequiredOpen(false)}
          onLogin={() => handleKakaoLogin()}
        />
      ) : null}
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
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  if (disabled || !onClick) {
    return (
      <div
        className={
          "body1 w-full bg-transparent px-0 py-3 text-left " +
          (disabled
            ? "pointer-events-none text-[var(--color-grey-550)]"
            : "text-[var(--color-white)]")
        }
        aria-disabled={disabled}
      >
        {children}
      </div>
    );
  }

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

function LoginRequiredModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-[#0C0D1199]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="flex w-[320px] flex-col items-center gap-5 rounded-2xl bg-[var(--color-grey-850)] px-6 py-8 text-center"
      >
        <div className="flex flex-col gap-2">
          <p className="title2 text-[var(--color-white)]">
            더 깊이있는 경험을 위해서는
            <br />
            계정이 필요해요
          </p>
          <p className="body2 text-[var(--color-grey-450)]">
            로그인하고 쉽게 예약을 관리해보세요
          </p>
        </div>
        <button
          onClick={onLogin}
          className="relative flex h-14 w-full max-w-[280px] items-center justify-center rounded-xl bg-[#FEE500] text-center text-base font-semibold text-neutral-900"
        >
          카카오 로그인
        </button>
        <button
          onClick={onClose}
          className="body2 cursor-pointer text-[var(--color-grey-450)]"
        >
          더 둘러볼게요
        </button>
      </div>
    </div>
  );
}

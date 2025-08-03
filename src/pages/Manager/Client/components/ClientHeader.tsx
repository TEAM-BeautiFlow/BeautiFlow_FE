import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ClientHeaderProps {
  title: string;
  rightContent?: ReactNode;
  onRightClick?: () => void;
  isSearchOpen?: boolean;
}

export default function ClientHeader({
  title,
  rightContent,
  onRightClick,
  isSearchOpen = false,
}: ClientHeaderProps) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-14 flex h-[60px] items-center justify-between px-5 py-2.5">
      {isSearchOpen ? (
        <div className="relative flex w-full gap-2">
          {/* 왼쪽: 뒤로가기 버튼 */}
          <div className="flex items-center gap-2.5">
            <button onClick={goBack} className="cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#F3F3F3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <input
            type="text"
            placeholder="입력된 검색어 MAX는 273 입니다아아아..."
            className="body2 w-[303px] rounded-[20px] bg-[var(--color-grey-850)] py-[6px] pr-[44px] pl-[14px] placeholder:text-[var(--color-grey-50)]"
          />

          {/* 오른쪽: 커스텀 버튼 */}
          <div className="absolute top-[4px] right-2.5">
            {rightContent && (
              <button onClick={onRightClick} className="cursor-pointer">
                {rightContent}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          {/* 왼쪽: 뒤로가기 버튼 */}
          <div className="flex items-center gap-2.5">
            <button onClick={goBack} className="cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#F3F3F3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 중앙: 타이틀 */}
          <div className="flex flex-1 justify-center px-2">
            {isSearchOpen ? (
              <input
                type="text"
                placeholder="입력된 검색어 MAX는 273 입니다아아아..."
                className="w-full rounded-full bg-[#3A3A3A] px-4 py-1 text-sm text-white placeholder:text-gray-400"
              />
            ) : (
              <span className="label1 block text-center text-[var(--color-grey-50)]">
                {title}
              </span>
            )}
          </div>

          {/* 오른쪽: 커스텀 버튼 */}
          <div>
            {rightContent && (
              <button onClick={onRightClick} className="cursor-pointer">
                {rightContent}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

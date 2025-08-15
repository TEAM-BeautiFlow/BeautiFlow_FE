import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ChatHeaderProps {
  title: string;
  rightContent?: ReactNode;
  onRightClick?: () => void;
}

export default function ChatHeader({
  title,
  rightContent,
  onRightClick,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-14 flex h-[60px] items-center justify-between px-5 py-3">
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
      <div className="flex flex-col items-center">
        <span className="label1 text-[var(--color-grey-50)]">{title}</span>
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
  );
}

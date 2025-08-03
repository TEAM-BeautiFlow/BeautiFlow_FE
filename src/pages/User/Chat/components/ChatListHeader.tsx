import { useNavigate } from "react-router-dom";

export default function ChatListHeader() {
  // 뒤로가기
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="mt-14 flex h-[60px] items-center justify-between px-5 py-2.5">
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
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col items-center">
        <span className="label1 text-[var(--color-grey-150)]">채팅하기</span>
      </div>
      <div className="w-6"></div>
    </div>
  );
}

export default function ChatRoomHeader() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <button>
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
      <div className="flex flex-col items-center">
        <span className="text-xs text-[#545454]">샵 이름</span>
        <span className="text-base text-white">상대방 이름</span>
      </div>
      <button className="flex h-8 w-8 items-center justify-center rounded-full">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="36" rx="18" fill="#3A3A3A" />
          <path
            d="M29.0688 12.2588C35.1716 13.5937 30.7834 26.4332 24.6717 27.7258C23.2498 28.0265 22.3459 28.1353 20.951 27.7258C16.7 26.4778 22.4252 19.3446 17.9971 19.2934C13.5549 19.2421 19.171 26.4694 14.9078 27.7258C13.5218 28.1342 12.6246 28.0393 11.2097 27.7479C5.09944 26.4897 0.874468 13.5855 6.97039 12.2588C8.26143 11.9779 9.07223 11.9329 10.3528 12.2588C14.9934 13.4398 8.34234 24.1064 13.1264 24.269C17.951 24.4329 11.6518 13.4631 16.3284 12.2588C17.6592 11.9161 18.5165 11.9113 19.8461 12.2588C24.4769 13.4693 18.0839 24.2887 22.8677 24.2025C27.6306 24.1167 21.0483 13.4445 25.6639 12.2588C26.9522 11.9279 27.7695 11.9746 29.0688 12.2588Z"
            fill="#6E6E6E"
          />
        </svg>
      </button>
    </div>
  );
}

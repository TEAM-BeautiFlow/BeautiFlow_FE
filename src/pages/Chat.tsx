const messages = [
  { sender: "you", text: "안녕하세요 내일 추가 시술 가능할까요?" },
  { sender: "me", text: "안녕하세요 하늘님:)" },
  {
    sender: "me",
    text: "아쉽지만 바로 다음 시간대에 다른 시술이 예정되어 있어서 임의로 연장하기는 쉽지 않을 것 같아요ㅜㅜ",
  },
];

export default function ChatRoom() {
  return (
    <div className="mx-auto flex h-screen w-screen flex-col bg-[#1A1A1A] px-4 py-2 text-white">
      {/* 상단 헤더 */}
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
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
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

      {/* 채팅 메시지 */}
      <div className="flex-1 space-y-2 overflow-y-auto py-2">
        {messages.map((message, index) => {
          const isLastOfSender =
            index === messages.length - 1 ||
            messages[index + 1].sender !== message.sender;

          return (
            <div
              key={index}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-[13px] leading-relaxed tracking-tight ${
                  message.sender === "me" ? "bg-[#9A50E0]" : "bg-[#3A3A3A]"
                } ${message.sender === "me" && isLastOfSender ? "rounded-br-none" : ""} ${message.sender === "you" && isLastOfSender ? "rounded-bl-none" : ""}`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 입력창 */}
      <div className="flex items-center gap-2 pb-4">
        <button>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="16" fill="#3A3A3A" />
            <path
              d="M16 9V23M9 16H23"
              stroke="#F3F3F3"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="메세지 입력"
            className="w-full flex-1 rounded-full bg-[#3A3A3A] px-4 py-2 text-sm text-white placeholder-[#8E8E8E]"
          />
          <button className="absolute top-0.5 right-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#9A50E0" />
              <path
                d="M9.12447 7.87346C9.45186 7.8233 9.73317 7.91444 9.86861 7.96135C10.0486 8.02374 10.2618 8.12109 10.4624 8.21135L24.393 14.4799C24.5891 14.5681 24.7993 14.662 24.9633 14.7543C25.0882 14.8246 25.3387 14.9725 25.5171 15.2465L25.5883 15.3715L25.6528 15.5229C25.7812 15.8822 25.7594 16.2812 25.5883 16.6274C25.4126 16.9829 25.1061 17.1652 24.9633 17.2455C24.7993 17.3378 24.5891 17.4317 24.393 17.5199L10.4672 23.7865C10.2658 23.8772 10.052 23.974 9.87154 24.0365C9.71684 24.0901 9.37163 24.2014 8.98385 24.0932C8.55472 23.9734 8.20633 23.6586 8.0444 23.2436C7.89842 22.8688 7.97523 22.5142 8.01315 22.3549C8.05737 22.1692 8.13253 21.947 8.2026 21.7377L9.87057 16.7504H15.3335C15.7474 16.7502 16.0832 16.4143 16.0835 16.0004C16.0835 15.5863 15.7475 15.2506 15.3335 15.2504H9.85299L8.19576 10.2563C8.12647 10.0475 8.05192 9.82551 8.00826 9.64006C7.97076 9.4806 7.89599 9.12619 8.04244 8.75237L8.11178 8.601C8.29312 8.26193 8.60687 8.00906 8.9819 7.90471L9.12447 7.87346Z"
                fill="#1A1A1A"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

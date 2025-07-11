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
    <div className="mx-auto flex h-screen w-screen flex-col bg-[var(--color-grey-1000)] px-5">
      {/* 상단 헤더 */}
      <div className="mt-14 flex h-[60px] items-center justify-between py-2.5">
        <div className="flex items-center gap-2.5">
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
          <span className="caption2 text-[var(--color-grey-650)]">샵 이름</span>
          <span className="label1 text-[var(--color-grey-150)]">
            상대방 이름
          </span>
        </div>
        <button className="">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="20" fill="#3A3A3A" />
            <path
              d="M32.6501 14.275C39.6246 15.6933 34.6096 29.3353 27.6248 30.7086C25.9997 31.0282 24.9667 31.1437 23.3726 30.7086C18.5143 29.3827 25.0573 21.8036 19.9966 21.7493C14.9199 21.6948 21.3383 29.3737 16.466 30.7086C14.8821 31.1426 13.8566 31.0418 12.2396 30.7322C5.25651 29.3953 0.427964 15.6846 7.39473 14.275C8.87021 13.9765 9.79684 13.9288 11.2603 14.275C16.5638 15.5298 8.96268 26.8631 14.4301 27.0358C19.944 27.21 12.7449 15.5546 18.0896 14.275C19.6106 13.9109 20.5903 13.9058 22.1098 14.275C27.4022 15.5611 20.0959 27.0568 25.5631 26.9652C31.0064 26.874 23.4838 15.5348 28.7587 14.275C30.2311 13.9234 31.1651 13.9731 32.6501 14.275Z"
              fill="#6E6E6E"
            />
          </svg>
        </button>
      </div>

      {/* 채팅 메시지 */}
      <div className="mt-3 flex-1 gap-2.5 space-y-2 overflow-y-auto py-2">
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
                className={`body2 max-w-[80%] rounded-[20px] px-4 py-2 text-[var(--color-grey-50)] ${
                  message.sender === "me"
                    ? "bg-[var(--color-purple)]"
                    : "bg-[var(--color-grey-850)]"
                } ${message.sender === "me" && isLastOfSender ? "rounded-br-[2px]" : ""} ${message.sender === "you" && isLastOfSender ? "rounded-bl-[2px]" : ""}`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 입력창 */}
      <div className="mb-[34px] flex items-center gap-2">
        <button>
          {/* <svg
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
          </svg> */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="16" fill="#3A3A3A" />
            <path
              d="M20.2002 6.25C21.0278 6.25 21.6936 6.24903 22.2314 6.29297C22.7781 6.33763 23.258 6.43287 23.7022 6.65918C24.4078 7.01871 24.9813 7.59225 25.3408 8.29785C25.5671 8.74205 25.6624 9.22195 25.707 9.76856C25.751 10.3064 25.75 10.9722 25.75 11.7998V20.2002L25.7451 21.3242C25.7398 21.6614 25.729 21.9625 25.707 22.2314C25.6624 22.7781 25.5671 23.258 25.3408 23.7022C24.9813 24.4078 24.4078 24.9813 23.7022 25.3408C23.258 25.5671 22.7781 25.6624 22.2314 25.707C21.9625 25.729 21.6614 25.7398 21.3242 25.7451L20.2002 25.75H10.9316C10.6436 25.75 10.3761 25.751 10.166 25.7324C10.1563 25.7316 10.1462 25.7295 10.1357 25.7285C10.0072 25.7227 9.88483 25.7165 9.76856 25.707C9.22195 25.6624 8.74205 25.5671 8.29785 25.3408C7.59225 24.9813 7.01871 24.4078 6.65918 23.7022C6.43287 23.258 6.33763 22.7781 6.29297 22.2314C6.24903 21.6936 6.25 21.0278 6.25 20.2002V11.7998C6.25 10.9722 6.24903 10.3064 6.29297 9.76856C6.33763 9.22195 6.43287 8.74205 6.65918 8.29785C7.01871 7.59225 7.59225 7.01871 8.29785 6.65918C8.74205 6.43287 9.22195 6.33763 9.76856 6.29297C10.3064 6.24903 10.9722 6.25 11.7998 6.25H20.2002ZM21.5742 13.8008C21.0756 12.9832 19.9489 12.8361 19.2568 13.498L9.55469 22.7773C8.90341 23.4006 9.34465 24.4999 10.2461 24.5H21C22.933 24.5 24.5 22.933 24.5 21V18.8799C24.5 18.6963 24.4491 18.5162 24.3535 18.3594L21.5742 13.8008ZM12.5 10C11.1194 10.0001 10 11.1194 10 12.5C10 13.8807 11.1194 14.9999 12.5 15C13.8807 15 15 13.8807 15 12.5C15 11.1193 13.8807 10 12.5 10Z"
              fill="#F3F3F3"
            />
          </svg>
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="메세지 입력"
            className="body2 h-10 w-full flex-1 rounded-full bg-[var(--color-grey-850)] px-4 py-2 placeholder-[var(--color-grey-650)]"
          />
          <button className="absolute top-1 right-1">
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

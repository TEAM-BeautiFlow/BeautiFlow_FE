export default function ChatInput() {
  return (
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
  );
}

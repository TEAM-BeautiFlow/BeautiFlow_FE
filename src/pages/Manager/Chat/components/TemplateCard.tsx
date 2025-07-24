// components/StatusCard.jsx
export default function TemplateCard() {
  return (
    <div className="mx-5 my-4 flex w-[335px] flex-col gap-4 rounded-[6px] bg-[var(--color-grey-950)] p-4">
      {/* 상태 표시 */}
      <div className="relative flex justify-between">
        <span className="body1 text-[#51C879]">활성화</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="7" r="1.5" fill="#BDBEBD" />
          <circle cx="12" cy="12" r="1.5" fill="#BDBEBD" />
          <circle cx="12" cy="17" r="1.5" fill="#BDBEBD" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        {/* 텍스트 내용 */}
        <div className="label1 line-clamp-1 font-medium text-[var(--color-grey-150)]">
          템플릿명은 MAX 228px이며 이후...
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center gap-4 text-[13px] text-[#B0B0B0]">
          <div className="body2 flex items-center gap-1 text-[var(--color-grey-450)]">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9166 10.0833L17.2505 11.75L15.5833 10.0833M17.4542 11.3333C17.4845 11.0597 17.5 10.7817 17.5 10.5C17.5 6.35786 14.1421 3 10 3C5.85786 3 2.5 6.35786 2.5 10.5C2.5 14.6421 5.85786 18 10 18C12.3561 18 14.4584 16.9136 15.8333 15.2144M10 6.33333V10.5L12.5 12.1667"
                stroke="#6E6E6E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            시술 후 3일
          </div>
          <div className="body2 flex items-center gap-1 text-[var(--color-grey-450)]">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99955 13C6.24955 13 5.00855 14.2755 3.51288 16.255C3.19097 16.681 3.03002 16.894 3.03528 17.1819C3.03935 17.4043 3.17902 17.6849 3.35402 17.8222C3.58054 18 3.89444 18 4.52224 18H15.4769C16.1047 18 16.4186 18 16.6451 17.8222C16.8201 17.6849 16.9598 17.4043 16.9638 17.1819C16.9691 16.894 16.8081 16.681 16.4862 16.255C14.9906 14.2755 13.7495 13 9.99955 13Z"
                stroke="#6E6E6E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.99955 10.5C12.0706 10.5 13.7495 8.82107 13.7495 6.75C13.7495 4.67893 12.0706 3 9.99955 3C7.92848 3 6.24955 4.67893 6.24955 6.75C6.24955 8.82107 7.92848 10.5 9.99955 10.5Z"
                stroke="#6E6E6E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            자주 오는 고객 +3
          </div>
        </div>
      </div>
    </div>
  );
}

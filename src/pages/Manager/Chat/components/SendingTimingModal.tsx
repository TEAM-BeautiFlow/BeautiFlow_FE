import { useState } from "react";

interface SendTimingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selected: string) => void;
}

const options = ["시술 전", "시술 후"];

export default function SendTimingModal({
  visible,
  onClose,
  onConfirm,
}: SendTimingModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");

  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm(selectedOption);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-[375px] rounded-t-[20px] bg-[var(--color-grey-850)] px-5 pt-6 pb-[30px]"
      >
        {/* 헤더 */}
        <div className="title1 mb-4 text-white">발송 시점</div>

        {/* 옵션 리스트 */}
        <div className="flex flex-col gap-4 text-white">
          {options.map(option => (
            <button
              key={option}
              className="flex items-center gap-2"
              onClick={() => setSelectedOption(option)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.0001 7L9.0507 16L4.5 11.4494"
                  stroke={
                    selectedOption === option
                      ? "var(--color-purple)"
                      : "var(--color-grey-650)"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={`body2 ${
                  selectedOption === option
                    ? "text-[var(--color-purple)]"
                    : "text-[var(--color-grey-150)]"
                }`}
              >
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* 하단 확인 버튼 */}
        <div className="mt-8">
          <button
            onClick={handleConfirm}
            disabled={!selectedOption}
            className={`label1 w-full rounded-[6px] py-[14px] text-center ${
              selectedOption
                ? "bg-[var(--color-purple)] text-white"
                : "bg-[var(--color-grey-700)] text-[var(--color-grey-500)]"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

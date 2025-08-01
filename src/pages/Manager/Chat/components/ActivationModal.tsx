import { useState } from "react";

interface ActivationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (status: string) => void;
}

export default function ActivationModal({
  visible,
  onClose,
  onConfirm,
}: ActivationModalProps) {
  const [selected, setSelected] = useState<string>("활성화");
  const options = ["활성화", "비활성화"];

  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return (
    <div
      className="absolute bottom-0 flex h-full items-end justify-center bg-[#0C0D1199]"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="flex w-[375px] flex-col gap-5 rounded-t-[20px] bg-[var(--color-grey-850)] px-5 pt-6 pb-[30px]"
      >
        {/* 제목 */}
        <div className="title1 mb-2 text-white">활성화 상태</div>

        {/* 옵션 리스트 */}
        <div className="flex flex-col gap-4">
          {options.map(option => (
            <div key={option} className="flex items-center gap-2">
              <button
                onClick={() => setSelected(option)}
                className="cursor-pointer"
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
                    stroke={selected === option ? "#A83DFF" : "#676767"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="body2 text-[var(--color-grey-150)]">
                {option}
              </span>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <button
          onClick={handleConfirm}
          className="label1 mt-4 h-[52px] w-full rounded-[4px] bg-[var(--color-purple)] text-[var(--color-grey-150)]"
        >
          확인
        </button>
      </div>
    </div>
  );
}

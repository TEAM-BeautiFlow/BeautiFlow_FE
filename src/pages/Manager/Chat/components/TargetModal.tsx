import { useState } from "react";

interface TargetModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedTargets: string[]) => void;
}

export default function TargetModal({
  visible,
  onClose,
  onConfirm,
}: TargetModalProps) {
  const [targets] = useState<string[]>([
    "전체",
    "자주 오는 고객",
    "비활성화",
    "VIP",
  ]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  if (!visible) return null;

  const toggleTarget = (target: string) => {
    setSelectedTargets(prev =>
      prev.includes(target)
        ? prev.filter(t => t !== target)
        : [...prev, target],
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedTargets);
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
        <div className="flex flex-col gap-2 text-white">
          <span className="title1 mb-2 text-white">발송 대상</span>
          <div className="flex flex-col gap-4">
            {targets.map(target => {
              const isSelected = selectedTargets.includes(target);
              return (
                <div key={target} className="flex items-center gap-1">
                  <button
                    onClick={() => toggleTarget(target)}
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
                        stroke={
                          isSelected
                            ? "var(--color-purple)"
                            : "var(--color-grey-650)"
                        }
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="body2 text-[var(--color-grey-150)]">
                    {target}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex h-[52px] items-center gap-2">
          <button
            onClick={handleConfirm}
            className="label1 w-full items-center justify-center rounded-[4px] bg-[var(--color-purple)] py-[18px] text-[var(--color-grey-150)]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

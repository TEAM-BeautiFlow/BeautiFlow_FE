import { useEffect, useState } from "react";

interface GroupSettingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedGroups: string[]) => void;
  initialGroups?: string[];
  initialSelectedGroups?: string[];
  onAddGroup?: (name: string) => void;
}

export default function GroupSettingModal({
  visible,
  onClose,
  onConfirm,
  initialGroups = ["전체", "VIP", "자주 오는 고객"], // 기본값
  initialSelectedGroups = [], // 기본값
}: GroupSettingModalProps) {
  const [groups, setGroups] = useState<string[]>(["전체", "VIP"]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // 동기화
  useEffect(() => {
    if (visible) {
      setGroups(initialGroups);
      setSelectedGroups(initialSelectedGroups);
      setIsAddingGroup(false);
      setNewGroupName("");
    }
  }, [visible, initialGroups, initialSelectedGroups]);
  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm(selectedGroups);
    onClose();
  };

  const handleReset = () => {
    setSelectedGroups([]);
    setNewGroupName("");
    setIsAddingGroup(false);
  };

  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => {
      if (group === "전체") {
        return prev.includes("전체") ? [] : ["전체"];
      }
      const next = prev.filter(g => g !== "전체"); // '전체' 제거
      return next.includes(group)
        ? next.filter(g => g !== group)
        : [...next, group];
    });
  };

  const handleSaveGroup = () => {
    const trimmed = newGroupName.trim();
    if (trimmed && !groups.includes(trimmed)) {
      setGroups(prev => [...prev, trimmed]);
      setSelectedGroups(prev => [...prev, trimmed]); // 선택도 반영
    }
    setNewGroupName("");
    setIsAddingGroup(false);
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
        {/* 그룹 리스트 */}
        <div className="flex flex-col gap-2 text-white">
          <span className="title1 mb-2 text-white">그룹 설정</span>
          <div className="flex flex-col gap-4">
            {groups.map(group => {
              const isSelected = selectedGroups.includes(group);
              return (
                <div key={group} className="flex items-center gap-1">
                  <button
                    onClick={() => toggleGroup(group)}
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
                            : "var(--color-grey-650"
                        }
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="body2 text-[var(--color-grey-150)]">
                    {group}
                  </div>
                </div>
              );
            })}

            {/* 그룹 추가 */}
            {isAddingGroup ? (
              <div className="flex items-center gap-[18px]">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="그룹명을 입력해주세요"
                  className="label2 flex w-[277px] items-center gap-[10px] rounded-[4px] bg-[var(--color-grey-750)] px-4 py-2 placeholder:text-[var(--color-grey-550)]"
                />
                <button
                  onClick={handleSaveGroup}
                  className="label2 cursor-pointer text-[var(--color-purple)]"
                >
                  저장
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsAddingGroup(true);
                    setNewGroupName("");
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="#6E6E6E"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <div className="body2 text-[var(--color-grey-450)]">
                  그룹 추가
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex h-[52px] items-center gap-2">
          <button
            onClick={handleReset}
            className="label1 w-[96px] items-center justify-center rounded-[4px] bg-[var(--color-grey-750)] py-[18px] text-[var(--color-grey-150)]"
          >
            초기화
          </button>
          <button
            onClick={handleConfirm}
            className="label1 w-[231px] items-center justify-center rounded-[4px] bg-[var(--color-purple)] py-[18px] text-[var(--color-grey-150)]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

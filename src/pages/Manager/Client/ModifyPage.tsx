import { useState } from "react";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import ClientHeader from "./components/ClientHeader";
import GroupSettingModal from "./components/GroupSettingModal";

export default function ModifyPage() {
  const [text, setText] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단 */}
      <ClientHeader
        title="고객 관리"
        rightContent={
          <span className="label2 text-[var(--color-purple)]">수정</span>
        }
      />

      {/* 수정사항 */}
      <div>
        {/*그룹 설정*/}
        <div className="mb-9 px-5">
          <div className="label1 flex gap-[3px] py-2">
            <label className="label1 text-[var(--color-grey-150)]">
              그룹 설정
            </label>
          </div>
          <div
            onClick={() => setIsGroupModalOpen(true)}
            className="body2 flex h-[45px] w-full items-center justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-550)]"
          >
            {selectedGroups.length === 0 ? (
              <span className="body2 items-center text-[var(--color-grey-550)]">
                그룹을 선택해주세요
              </span>
            ) : (
              selectedGroups.map(group => (
                <div
                  key={group}
                  className="inline-flex h-[30px] items-center justify-center gap-[2px] rounded-[20px] border border-[1.5px] border-[var(--color-purple)] bg-[var(--color-dark-purple)] py-1 pr-[10px] pl-3 text-[var(--color-grey-150)]"
                >
                  <span>{group}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation(); // 모달 안 열리게 방지
                      setSelectedGroups(prev => prev.filter(g => g !== group));
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3337 4.6665L4.66699 11.3332M4.66699 4.6665L11.3337 11.3332"
                        stroke="#DDDDDD"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
            <button className="cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#BDBEBD"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 기타 메모 */}
        <div className="mb-9 px-5">
          <label className="label1 block py-3 text-[var(--color-grey-150)]">
            기타 메모
          </label>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
            className="body2 flex w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]"
            placeholder="특이사항을 기록해주세요."
          />
          <div className="caption2 mt-[3px] flex justify-end text-[var(--color-grey-550)]">
            {text.length}/500
          </div>
        </div>
      </div>

      {/* 하단 */}
      <ManagerNavbar />

      {/* 그룹 설정 모달 */}
      <GroupSettingModal
        visible={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onConfirm={(groups: string[]) => {
          setSelectedGroups(groups); // 배열로 설정
          setIsGroupModalOpen(false);
        }}
      />
    </div>
  );
}

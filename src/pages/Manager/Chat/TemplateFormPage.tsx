import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import SendTimingModal from "./components/SendingTimingModal";
import ActivationModal from "./components/ActivationModal";
import TargetModal from "./components/TargetModal";

export default function TemplateFormPage() {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<string[]>(["전체"]);

  return (
    <div className="mx-auto flex w-[375px] flex-col bg-[var(--color-grey-1000)]">
      <ChatHeader
        title="헤더이름"
        rightContent={
          <div className="label2 text-[var(--color-purple)]">저장</div>
        }
        onRightClick={() => console.log("아이콘 클릭됨")}
      />

      {/* 템플릿명 */}
      <div className="mb-9 px-5">
        <div className="label1 flex gap-[3px] py-2">
          <label className="label1 text-[var(--color-grey-150)]">
            템플릿명
          </label>
          <span className="text-[#D2636A]">*</span>
        </div>

        <input
          type="text"
          className="body2 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="50자 내로 ~"
        />
      </div>

      {/*활성화 상태*/}
      <div className="mb-9 px-5">
        <div className="label1 flex gap-[3px] py-2">
          <label className="label1 text-[var(--color-grey-150)]">
            활성화 상태
          </label>
          <span className="text-[#D2636A]">*</span>
        </div>
        <div className="body2 flex h-[45px] w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]">
          활성화
          <button
            onClick={() => setIsActivationModalOpen(true)}
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
                d="M6 9L12 15L18 9"
                stroke="#BDBEBD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* 발송 시점 */}
      <div className="mb-9 px-5">
        <div className="gap-2 py-2">
          <div className="label1 flex gap-[3px]">
            <label className="label1 text-[var(--color-grey-150)]">
              발송 시점
            </label>
            <span className="text-[#D2636A]">*</span>
          </div>
          <span className="body2 mt-2 block text-xs text-[var(--color-grey-450)]">
            모든 메세지는 정오를 기준으로 발송됩니다.
          </span>
        </div>
        <div className="relative flex gap-[7px]">
          <div className="body2 flex h-[45px] w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]">
            시술 전
            <button
              onClick={() => setShowModal(true)}
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
                  d="M6 9L12 15L18 9"
                  stroke="#BDBEBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <input
            type="text"
            inputMode="numeric"
            className="body2 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[13px] text-[var(--color-grey-150)]"
            placeholder=""
          />
          <div className="body2 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-grey-450)]">
            일
          </div>
        </div>
      </div>
      {/* 발송 대상 */}
      <div className="mb-9 px-5">
        <div className="label1 flex gap-[3px] py-2">
          <label className="label1 text-[var(--color-grey-150)]">
            발송 대상
          </label>
          <span className="text-[#D2636A]">*</span>
        </div>
        <div className="body2 flex h-[45px] w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]">
          {selectedTargets.join(", ")}

          <button
            onClick={() => setIsTargetModalOpen(true)}
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
                d="M6 9L12 15L18 9"
                stroke="#BDBEBD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* 발송 텍스트 */}
      <div className="mb-9 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          발송 텍스트
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={100}
          rows={4}
          className="body2 flex h-[116px] w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]"
          placeholder="100자 내로 ~"
        />
        <div className="caption2 mt-[3px] flex justify-end text-[var(--color-grey-550)]">
          {text.length}/100
        </div>
      </div>
      <ManagerNavbar />

      <SendTimingModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={value => console.log("선택된 값:", value)}
      />
      <ActivationModal
        visible={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        onConfirm={status => console.log("선택된 활성화 상태:", status)}
      />
      <TargetModal
        visible={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        onConfirm={selected => {
          setSelectedTargets(selected);
          setIsTargetModalOpen(false);
        }}
      />
    </div>
  );
}

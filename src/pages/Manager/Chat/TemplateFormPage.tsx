import { useState } from "react";
import TemplateHeader from "./components/TemplateHeader";

type Props = {
  onClose: () => void;
};
export default function TemplateFormPage({ onClose }: Props) {
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);

  return (
    <div className="mx-auto flex w-[375px] flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 네비게이션 */}
      <div className="mt-14 flex h-[60px] items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <button onClick={onClose} className="cursor-pointer">
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
          <span className="label1 text-[var(--color-grey-150)]">헤더 이름</span>
        </div>
        <div className="label2 text-[var(--color-purple)]">저장</div>
      </div>
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
      //
      {/*활성화 상태*/}
      <div className="mb-3 px-5">
        <div className="label1 flex gap-[3px] py-3">
          <label className="label1 text-[var(--color-grey-150)]">
            활성화 상태
          </label>
          <span className="text-[#D2636A]">*</span>
        </div>
        <div className="body2 flex h-[45px] w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]">
          활성화
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
      {/* 발송 시점 */}
      <div className="mb-3 px-5">
        <div className="flex flex-col py-3">
          <div className="label1 flex gap-[3px]">
            <label className="label1 text-[var(--color-grey-150)]">
              발송시점{" "}
            </label>
            <span className="text-[#D2636A]">*</span>
          </div>
          <span className="body2 mt-2 block text-xs text-[var(--color-grey-550)]">
            모든 메세지는 정오를 기준으로 발송됩니다.
          </span>
        </div>
        <input
          type="text"
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="운영하고 있는 SNS나 관련 링크를 입력해주세요."
        />
      </div>
      {/* 발송 대상 */}
      <div className="mb-3 px-5">
        <label className="body2 block py-3 text-[var(--color-grey-150)]">
          발송 대상
        </label>

        <input
          type="text"
          className="body2 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="ex) 신한 110-123-456789 예금주명"
        />
      </div>
      {/* 발송 텍스트 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          발송 텍스트
        </label>
        <textarea
          rows={4}
          className="body2 h-[90px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="50자 내로 ~"
        />
      </div>
    </div>
  );
}

type Props = {
  onClose: () => void;
};

export default function TemplateHeader({ onClose }: Props) {
  return (
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
  );
}

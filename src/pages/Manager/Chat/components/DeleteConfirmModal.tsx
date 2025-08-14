interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  confirmDisabled?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onDelete,
  confirmDisabled = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-0 flex h-full w-[375px] items-center justify-center bg-[#0C0D1199]"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="flex h-[240px] w-[243px] flex-col gap-9 rounded-[8px] bg-[var(--color-grey-850)] px-6 py-6 text-center"
      >
        <div className="flex flex-col gap-2">
          <p className="label1 text-[var(--color-grey-150)]">
            받은 메시지함에서 채팅을
            <br />
            삭제하시겠어요?
          </p>
          <p className="body2 text-[var(--color-grey-450)]">
            회원님이 차단하지 않는 한 다시
            <br />
            메시지를 보낼 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onDelete}
            className="cursor-pointer text-[14px] font-semibold text-[#D2636A] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={confirmDisabled}
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer text-[14px] font-semibold text-[var(--color-grey-150)]"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

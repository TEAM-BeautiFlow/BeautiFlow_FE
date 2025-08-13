import type { CustomerList } from "../../../../types/customer";

interface CustomerCardProps {
  customer: CustomerList;
  onRightClick: (customer: CustomerList) => void;
  onClick?: () => void;
}

export default function ClientCard({
  customer,
  onRightClick,
  onClick,
}: CustomerCardProps) {
  const MAX_VISIBLE_GROUPS = 2; // 몇 개까지 보일지

  return (
    <div
      key={customer.name}
      onClick={onClick}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(customer);
      }}
      className="mb-2 flex w-[335px] cursor-pointer items-center justify-between rounded-[4px] bg-[var(--color-grey-950)] px-4 py-3"
    >
      <div className="label1 text-[var(--color-grey-250)]">{customer.name}</div>
      {!customer.targetGroup.includes("전체") &&
        (() => {
          const groups = Array.isArray(customer.targetGroup)
            ? customer.targetGroup.filter(g => g !== "전체")
            : [];
          if (groups.length === 0) return null;

          const shown = groups.slice(0, MAX_VISIBLE_GROUPS);
          const hidden = groups.length - shown.length;

          const text =
            hidden > 0
              ? `${shown.join(", ")}${shown.length ? " " : ""}+${hidden}`
              : shown.join(", ");

          return (
            <div className="body1 text-[var(--color-grey-550)]">{text}</div>
          );
        })()}
    </div>
  );
}

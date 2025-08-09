import type { CustomerList } from "../../../../types/chatlist";
import { useNavigate } from "react-router-dom";

interface CustomerCardProps {
  customer: CustomerList;
  onRightClick: (customer: CustomerList) => void;
}

export default function ClientCard({
  customer,
  onRightClick,
}: CustomerCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("mangedCustomer/:customerId");
  };

  return (
    <div
      key={customer.name}
      onClick={handleClick}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(customer);
      }}
      className="mb-2 flex w-[335px] items-center justify-between rounded-[4px] bg-[var(--color-grey-950)] px-4 py-3"
    >
      <div className="label1 text-[var(--color-grey-250)]">{customer.name}</div>
      {customer.tag && (
        <div className="body1 text-[var(--color-grey-550)]">{customer.tag}</div>
      )}
    </div>
  );
}

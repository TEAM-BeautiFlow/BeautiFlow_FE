import { useNavigate } from "react-router-dom";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import { useState } from "react";
const groups = ["VIP", "자주 오는 고객"];
const customers = ["손하늘", "이하늘"];
export default function GroupSet() {
  const navigate = useNavigate();

  const sendMessage = () => {
    // 이 부분에서 원하는 페이지로 이동
    navigate("/chat/rooms/groupchat");
  };

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const toggleItem = (
    item: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const isSelected = (item: string, list: string[]) => list.includes(item);

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="mx-auto h-screen w-[375px] bg-[var(--color-grey-1000)]">
      {/* 상단 */}
      <div className="flex items-center justify-between px-5 py-3 pt-14">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="cursor-pointer">
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
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-base text-white">발송 상대 초대</span>
        </div>
        <span
          onClick={sendMessage}
          className={`flex cursor-pointer items-center justify-center ${
            selectedGroups.length > 0 || selectedCustomers.length > 0
              ? "text-[var(--color-purple)]"
              : "text-[var(--color-grey-650)]"
          }`}
        >
          확인
        </span>
      </div>

      {/* 검색창 */}
      <input
        type="text"
        placeholder="고객명을 검색하세요"
        className="body2 mx-auto mt-3 block w-[335px] max-w-full rounded-[20px] bg-[var(--color-grey-850)] px-[14px] py-[6px] text-[var(--color-grey-50)] placeholder:text-[var(--color-grey-450)]"
      />

      {/* 리스트 */}
      <div className="mt-3 flex flex-col">
        {/* 그룹 섹션 */}
        <div className="flex flex-col gap-5 px-5">
          <div className="caption1 text-[var(--color-grey-550)]">그룹</div>
          <div className="label2 flex flex-col gap-4">
            {groups.map(group => (
              <div
                key={group}
                className="flex cursor-pointer items-center justify-between"
                onClick={() =>
                  toggleItem(group, selectedGroups, setSelectedGroups)
                }
              >
                <span
                  className={`${isSelected(group, selectedGroups) ? "text-[var(--color-purple)]" : "text-[var(--color-grey-150)]"}`}
                >
                  {group}
                </span>
                {isSelected(group, selectedGroups) && <CheckIcon />}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 h-[0.5px] bg-[var(--color-grey-850)]"></div>
        {/* 고객 섹션 */}
        <div className="mt-5 flex flex-col gap-5 px-5">
          <div className="caption1 text-[var(--color-grey-550)]">고객</div>
          <div className="label2 flex flex-col gap-4">
            {customers.map(customer => (
              <div
                key={customer}
                className="flex cursor-pointer items-center justify-between"
                onClick={() =>
                  toggleItem(customer, selectedCustomers, setSelectedCustomers)
                }
              >
                <span
                  className={`${isSelected(customer, selectedCustomers) ? "text-purple-400" : "text-white"}`}
                >
                  {customer}
                </span>
                {isSelected(customer, selectedCustomers) && <CheckIcon />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 */}
      <ManagerNavbar />
    </div>
  );
}
function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0001 7L9.0507 16L4.5 11.4494"
        stroke="#A83DFF"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

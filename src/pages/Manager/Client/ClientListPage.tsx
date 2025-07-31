import { useState } from "react";
import ClientHeader from "./components/ClientHeader";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import ClientCard from "./components/ClientCard";
import type { CustomerList } from "../../../types/chatlist";
import DeleteModal from "../../../components/DeleteModal";
import GroupSetModal from "./components/GroupSetModal";

//dummy
const dummyCustomers = [
  { name: "손하늘", tag: "VIP" },
  { name: "손하늘", tag: "자주 오는 고객" },
  { name: "손하늘", tag: "VIP" },
  { name: "손하늘", tag: "미정" },
  { name: "손하늘", tag: "VIP" },
];

export default function ClientListPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerList[]>(dummyCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | null>(
    null,
  );

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
  };

  // 모달
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const openBottomSheet = (customer: CustomerList) => {
    setSelectedCustomer(customer);
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setSelectedCustomer(null);
  };

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(["전체"]);

  // 삭제 기능
  const handleDeleteCustomer = () => {
    // 삭제 로직 구현해야함
    console.log("채팅 삭제됨!");
  };

  const handleReset = () => {
    setSelectedGroups(["전체"]);
  };

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단바 */}
      <ClientHeader
        title="고객 관리"
        rightContent={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.927 17.0401L20.4001 20.4001M19.2801 11.4401C19.2801 15.77 15.77 19.2801 11.4401 19.2801C7.11019 19.2801 3.6001 15.77 3.6001 11.4401C3.6001 7.11019 7.11019 3.6001 11.4401 3.6001C15.77 3.6001 19.2801 7.11019 19.2801 11.4401Z"
              stroke="#F3F3F3"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        }
        isSearchOpen={isSearchOpen}
        onRightClick={toggleSearch}
      />

      {/* 중간 내용 */}
      <div className="flex flex-col gap-5 px-5 py-4">
        {/* 필터 */}
        <div className="flex gap-2">
          {!selectedGroups.includes("전체") && (
            <button
              onClick={handleReset}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[var(--color-grey-700)]"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="30"
                  height="30"
                  rx="15"
                  fill="#545454"
                />
                <rect
                  x="1"
                  y="1"
                  width="30"
                  height="30"
                  rx="15"
                  stroke="#545454"
                  stroke-width="1.5"
                />
                <path
                  d="M21.4806 17.922C20.698 20.3775 18.4566 22.1504 15.8136 22.1504C12.5198 22.1504 9.84961 19.3968 9.84961 16C9.84961 12.6032 12.5198 9.84961 15.8136 9.84961C18.0212 9.84961 19.9486 11.0864 20.9798 12.9248M19.1684 13.6936H22.1504V10.6184"
                  stroke="#F3F3F3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}

          <div
            className={`inline-flex h-[30px] w-fit shrink-0 items-center justify-center gap-[2px] rounded-[20px] border-[1.5px] py-4 pr-[10px] pl-3 ${
              selectedGroups.includes("전체")
                ? "border border-[var(--color-grey-750)] text-[var(--color-grey-150)]"
                : "border border-[var(--color-purple)] bg-[var(--color-dark-purple)] text-[var(--color-purple)]"
            }`}
          >
            <span className="body1 line-clamp-1 text-[var(--color-grey-150)]">
              {selectedGroups.includes("전체")
                ? "전체"
                : selectedGroups.join(", ")}
            </span>
            <svg
              onClick={() => setIsGroupModalOpen(true)}
              className="cursor-pointer"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#DDDDDD"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* 리스트 */}
        <div className="">
          {customers
            .filter(customer =>
              selectedGroups.includes("전체")
                ? true
                : selectedGroups.includes(customer.tag || ""),
            )
            .map((customer, index) => (
              <ClientCard
                key={index}
                customer={customer}
                onRightClick={openBottomSheet}
              />
            ))}
        </div>
      </div>

      {/* 하단바 */}
      <ManagerNavbar />

      {/* 모달 */}
      {isBottomSheetOpen && selectedCustomer && (
        <DeleteModal
          visible={!!selectedCustomer}
          targetName={selectedCustomer?.name || ""}
          onClose={() => setSelectedCustomer(null)}
          onConfirm={handleDeleteCustomer}
        />
      )}

      {/* 그룹 설정 모달 */}
      <GroupSetModal
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

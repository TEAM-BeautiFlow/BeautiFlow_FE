import { useEffect, useMemo, useState } from "react";
import ClientHeader from "./components/ClientHeader";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import ClientCard from "./components/ClientCard";
import type { CustomerList } from "../../../types/customer";
import DeleteModal from "../../../components/DeleteModal";
import GroupSetModal from "./components/GroupSetModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//dummy
const dummyCustomers: CustomerList[] = [
  { customerId: 1, name: "김하늘", targetGroup: ["VIP"] },
  {
    customerId: 2,
    name: "손하늘",
    targetGroup: ["자주 오는 고객", "VIP", "블랙리스트"],
  },
  { customerId: 3, name: "배하늘", targetGroup: ["VIP"] },
  { customerId: 4, name: "윤하늘", targetGroup: ["미정"] },
  { customerId: 5, name: "이하늘", targetGroup: ["VIP"] },
];

export default function ClientListPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerList[]>(dummyCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    if (isSearchOpen) setQuery("");
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

  // 고객 리스트 불러오기
  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access Token이 없습니다.");
          return;
        }

        const onlyAll =
          selectedGroups.includes("전체") || selectedGroups.length === 0;

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/list`,
          {
            params: onlyAll ? {} : { groups: selectedGroups.join(",") },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (Array.isArray(response.data?.data)) {
          const mapped: CustomerList[] = response.data.data.map((c: any) => ({
            customerId: c.customerId,
            name: c.name,
            targetGroup: Array.isArray(c.targetGroup)
              ? c.targetGroup
              : c.targetGroup
                ? [c.targetGroup]
                : [],
          }));
          setCustomers(mapped);
        } else {
          console.warn("고객 리스트 응답이 배열이 아닙니다:", response.data);
        }
      } catch (error) {
        console.error("고객 리스트 불러오기 실패", error);
      }
    };

    fetchCustomerList();
  }, [selectedGroups]);

  // 검색 기능
  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const hasAll =
      selectedGroups.includes("전체") || selectedGroups.length === 0;

    return customers.filter(c => {
      // 1) 그룹 필터: '전체'면 통과, 아니면 교집합 있는지 확인
      const tg = Array.isArray(c.targetGroup) ? c.targetGroup : [];
      const inGroup = hasAll ? true : selectedGroups.some(g => tg.includes(g));

      // 2) 이름 필터: 검색어 비어있으면 통과, 아니면 포함 여부
      const nameOk =
        normalized.length === 0 ||
        (c.name ?? "").toLowerCase().includes(normalized);

      return inGroup && nameOk;
    });
  }, [customers, query, selectedGroups]);

  // 삭제 기능
  const handleDeleteCustomer = async () => {
    if (deleting) return; // 중복 클릭 방지
    if (!selectedCustomer) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access Token이 없습니다.");
      return;
    }

    const id = selectedCustomer.customerId;

    try {
      setDeleting(true);

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 로컬 목록에서 제거
      setCustomers(prev => prev.filter(c => c.customerId !== id));

      // 모달 닫기
      closeBottomSheet();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("고객 삭제 실패", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        alert(error.response?.data?.message ?? "삭제에 실패했습니다.");
      } else {
        console.error("알 수 없는 오류", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setDeleting(false);
    }
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
        searchValue={query}
        onSearchChange={setQuery}
        onCloseSearch={() => {
          setIsSearchOpen(false); /* setQuery(""); */
        }}
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
          {filteredCustomers.length === 0 ? (
            <div className="body2 text-[var(--color-grey-550)]">
              일치하는 고객이 없습니다.
            </div>
          ) : (
            filteredCustomers.map(c => (
              <ClientCard
                key={c.customerId}
                customer={c}
                onRightClick={openBottomSheet}
                onClick={() =>
                  navigate(`/mangedCustomer/${c.customerId}`, { state: c })
                }
              />
            ))
          )}
        </div>
      </div>

      {/* 하단바 */}
      <ManagerNavbar />

      {/* 모달 */}
      {isBottomSheetOpen && selectedCustomer && (
        <DeleteModal
          visible={!!selectedCustomer}
          targetName={selectedCustomer?.name ?? ""}
          onClose={closeBottomSheet}
          onConfirm={handleDeleteCustomer}
        />
      )}

      {/* 그룹 설정 모달 */}
      <GroupSetModal
        visible={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onConfirm={(groups: string[]) => {
          const next = groups.includes("전체") ? ["전체"] : groups;
          setSelectedGroups(next);
          setIsGroupModalOpen(false);
        }}
        initialSelectedGroups={selectedGroups}
      />
    </div>
  );
}

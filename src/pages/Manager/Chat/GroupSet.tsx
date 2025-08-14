import { useNavigate } from "react-router-dom";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import { useEffect, useMemo, useState } from "react";
import type { CustomerList } from "../../../types/customer";
import axios from "axios";
// 더미 데이터 예시
// const dummyData = [
//   {
//     customerId: 2,
//     name: "손님1",
//     groupCodes: ["아빠", "엄마", "VIP", "FREQUENT"],
//   },
//   {
//     customerId: 3,
//     name: "손님2",
//     groupCodes: ["FREQUENT"],
//   },
//   {
//     customerId: 4,
//     name: "손님3",
//     groupCodes: ["VIP"],
//   },
//   {
//     customerId: 5,
//     name: "손님4",
//     groupCodes: ["엄마"],
//   },
// ];

export default function GroupSet() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<CustomerList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [query, setQuery] = useState("");

  // 데이터 로드
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/list`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        // res.data.data 가 배열이라고 가정
        setCustomers(res.data?.data ?? []);
      } catch (e: any) {
        setError(
          axios.isAxiosError(e)
            ? `요청 실패: ${e.response?.status ?? "-"}`
            : "알 수 없는 오류",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  // useEffect(() => {
  //   // API 대신 더미 데이터 사용
  //   setLoading(true);
  //   setError(null);

  //   // 0.5초 뒤에 응답 온 것처럼 시뮬레이션
  //   setTimeout(() => {
  //     setCustomers(dummyData);
  //     setLoading(false);
  //   }, 500);
  // }, []);

  const allGroups = useMemo(() => {
    const map = new Map<string, number>(); // 삽입 순서 유지
    for (const c of customers) {
      for (const code of c.groupCodes || []) {
        map.set(code, (map.get(code) || 0) + 1);
      }
    }
    return Array.from(map.entries()).map(([code]) => ({
      code,
      label: code, // ← 백엔드에서 받은 텍스트 그대로
    }));
  }, [customers]);

  // 그룹 선택 토글
  const toggleGroup = (code: string) => {
    setSelectedGroups(prev =>
      prev.includes(code) ? prev.filter(g => g !== code) : [...prev, code],
    );
    // 그룹 바꿀 때 고객 선택 유지할지 초기화할지 정책 선택
    // 유지하려면 삭제. 초기화하려면 아래 한 줄 주석 해제:
    // setSelectedCustomerIds([]);
  };

  // 고객 선택 토글
  const toggleCustomer = (id: number) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  // 그룹/검색 적용된 표시용 고객 목록
  const filteredCustomers = useMemo(() => {
    const q = query.trim();
    const base = customers; // 항상 전체
    return q ? base.filter(c => c.name.includes(q)) : base;
  }, [customers, query]);

  const isGroupSelected = (code: string) => selectedGroups.includes(code);
  const isCustomerSelected = (id: number) => {
    const manual = selectedCustomerIds.includes(id);
    const inGroup =
      selectedGroups.length > 0 &&
      (customers.find(c => c.customerId === id)?.groupCodes || []).some(code =>
        selectedGroups.includes(code),
      );
    return manual || inGroup;
  };

  const groupSelectedIds = useMemo(() => {
    if (selectedGroups.length === 0) return new Set<number>();
    const set = new Set<number>();
    for (const c of customers) {
      if ((c.groupCodes || []).some(code => selectedGroups.includes(code))) {
        set.add(c.customerId);
      }
    }
    return set;
  }, [customers, selectedGroups]);

  const goBack = () => navigate(-1);

  const sendMessage = () => {
    const finalIdsSet = new Set<number>(selectedCustomerIds);
    groupSelectedIds.forEach(id => finalIdsSet.add(id));

    const finalIds = Array.from(finalIdsSet);
    const selected = customers.filter(c => finalIds.includes(c.customerId));

    navigate("/chat/rooms/groupchat", {
      state: {
        customerIds: selected.map(c => c.customerId),
        customerNames: selected.map(c => c.name), // ← 이름도 함께 전달 (원하면)
      },
    });
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
          <span className="label1 text-[var(--color-grey-150)]">
            발송 상대 초대
          </span>
          {loading && (
            <span className="caption1 text-[var(--color-grey-550)]">
              불러오는 중…
            </span>
          )}
          {error && <span className="caption1 text-[#D2636A]">{error}</span>}
        </div>
        <span
          onClick={sendMessage}
          className={`label2 flex cursor-pointer items-center justify-center ${
            selectedGroups.length > 0 || selectedCustomerIds.length > 0
              ? "text-[var(--color-light-purple)]"
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
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="body2 mx-auto mt-3 block w-[335px] max-w-full rounded-[20px] bg-[var(--color-grey-850)] px-[14px] py-[6px] text-[var(--color-grey-50)] placeholder:text-[var(--color-grey-450)]"
      />

      {/* 리스트 */}
      <div className="mt-3 flex flex-col">
        {/* 그룹 섹션 */}
        <div className="flex flex-col gap-5 px-5">
          <div className="caption1 text-[var(--color-grey-550)]">그룹</div>
          <div className="label2 flex flex-col gap-4">
            {allGroups.map(g => (
              <button
                type="button"
                key={g.code}
                className="flex items-center justify-between text-left"
                onClick={() => toggleGroup(g.code)}
              >
                <span
                  className={
                    isGroupSelected(g.code)
                      ? "text-[var(--color-light-purple)]"
                      : "text-[var(--color-grey-150)]"
                  }
                >
                  {g.label}
                </span>
                {isGroupSelected(g.code) && <CheckIcon />}
              </button>
            ))}
            {allGroups.length === 0 && !loading && (
              <span className="caption1 text-[var(--color-grey-550)]">
                등록된 그룹이 없습니다.
              </span>
            )}
          </div>
        </div>
        <div className="mt-8 h-[0.5px] bg-[var(--color-grey-850)]"></div>

        {/* 고객 섹션 */}
        <div className="mt-5 flex flex-col gap-5 px-5">
          <div className="caption1 text-[var(--color-grey-550)]">고객</div>
          <div className="label2 flex flex-col gap-4">
            {filteredCustomers.map(c => (
              <button
                type="button"
                key={c.customerId}
                className="flex items-center justify-between text-left"
                onClick={() => toggleCustomer(c.customerId)}
              >
                <span
                  className={
                    isCustomerSelected(c.customerId)
                      ? "text-[var(--color-light-purple)]"
                      : "text-[var(--color-grey-150)]"
                  }
                >
                  {c.name}
                </span>
                {isCustomerSelected(c.customerId) && <CheckIcon />}
              </button>
            ))}
            {filteredCustomers.length === 0 && !loading && (
              <span className="caption1 text-[var(--color-grey-550)]">
                표시할 고객이 없습니다.
              </span>
            )}
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
        stroke="var(--color-light-purple)"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

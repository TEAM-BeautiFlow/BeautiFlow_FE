import { useEffect, useMemo, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import type { CustomerDetail } from "../../../types/customer";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
type LocationState = Partial<CustomerDetail>;

export default function ChatProfile() {
  const { customerId } = useParams<{ customerId: string }>();

  const id = Number(customerId);
  const location = useLocation();
  const state = useMemo(
    () => location.state as LocationState | undefined,
    [location.state],
  );

  const [customer, setCustomer] = useState<CustomerDetail | null>(
    state
      ? {
          customerId: state.customerId ?? 0, // number 보장
          name: state.name ?? "",
          contact: state.contact ?? "",
          email: state.email ?? "",
          groupCodes: state.groupCodes ?? [],
          styleImageUrls: state.styleImageUrls ?? [],
          requestNotes: state.requestNotes ?? "",
          memo: state.memo ?? "",
        }
      : null,
  );
  if (!customer) {
    return <div className="p-4 text-gray-400">고객 정보가 없습니다.</div>;
  }

  const [, setCustLoading] = useState(!state);
  const [, setCustError] = useState<string | null>(null);
  // 고객 상세 GET
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setCustLoading(true);
        setCustError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          // 토큰 없으면 state만 보여주고 종료
          setCustLoading(false);
          if (!state) setCustError("로그인이 필요합니다.");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (cancelled) return;

        const d = res.data?.data;
        if (!d) {
          setCustError("고객 정보를 불러오지 못했습니다.");
          setCustLoading(false);
          return;
        }

        const mapped: CustomerDetail = {
          customerId: d.customerId ?? id,
          name: d.name ?? state?.name ?? "",
          contact: d.contact ?? state?.contact,
          email: d.email ?? state?.email,
          groupCodes: Array.isArray(d.groupCodes)
            ? d.groupCodes
            : d?.groupCodes
              ? [d.groupCodes]
              : (state?.groupCodes ?? []),
          styleImageUrls: Array.isArray(d.styleImageUrls)
            ? d.styleImageUrls.filter(
                (u: unknown): u is string => typeof u === "string",
              )
            : Array.isArray(state?.styleImageUrls)
              ? state!.styleImageUrls
              : [],
          requestNotes: d.requestNotes ?? state?.requestNotes,
          memo: d.memo ?? state?.memo,
        };

        setCustomer(mapped);
      } catch (e) {
        console.error("고객 상세 불러오기 실패", e);
        setCustError("고객 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setCustLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단 헤더 -> 상대방 정보 연결 (API 받은 후 작업) */}
      <ChatHeader
        title="상대방 이름"
        rightContent={
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="20" fill="#3A3A3A" />
            <path
              d="M32.6501 14.275C39.6246 15.6933 34.6096 29.3353 27.6248 30.7086C25.9997 31.0282 24.9667 31.1437 23.3726 30.7086C18.5143 29.3827 25.0573 21.8036 19.9966 21.7493C14.9199 21.6948 21.3383 29.3737 16.466 30.7086C14.8821 31.1426 13.8566 31.0418 12.2396 30.7322C5.25651 29.3953 0.427964 15.6846 7.39473 14.275C8.87021 13.9765 9.79684 13.9288 11.2603 14.275C16.5638 15.5298 8.96268 26.8631 14.4301 27.0358C19.944 27.21 12.7449 15.5546 18.0896 14.275C19.6106 13.9109 20.5903 13.9058 22.1098 14.275C27.4022 15.5611 20.0959 27.0568 25.5631 26.9652C31.0064 26.874 23.4838 15.5348 28.7587 14.275C30.2311 13.9234 31.1651 13.9731 32.6501 14.275Z"
              fill="#6E6E6E"
            />
          </svg>
        }
        onRightClick={() => console.log("아이콘 클릭됨")} // 이부분은 클릭하면 어떻게 되는지..?
      />
      {/* 프로필 */}
      {/* 개인정보 */}
      <div className="px-5 pt-3 pb-10">
        {/* 이름 */}
        <div className="mb-2 flex justify-between">
          <span className="h0 text-[var(--color-grey-150)]">
            {customer.name}
          </span>
        </div>

        {/* 이미지 목록 */}
        {customer.styleImageUrls && customer.styleImageUrls.length > 0 && (
          <div className="hide-scrollbar flex gap-1.5 overflow-x-auto">
            {customer.styleImageUrls.map((url, index) => (
              <div
                key={index}
                className="h-20 w-20 min-w-[80px] overflow-hidden rounded-[4px] bg-white"
              >
                <img
                  src={url}
                  alt={`style-${index}`}
                  className="h-full w-full object-cover"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 내용 */}
        <div className="mt-4 inline-flex flex-col gap-[6px]">
          <div className="flex gap-4">
            <span className="body2 text-[var(--color-grey-550)]">전화번호</span>
            <div className="body2 text-[var(--color-grey-150)]">
              {customer.contact}
            </div>
          </div>
          <div className="flex gap-4">
            <span className="body2 text-[var(--color-grey-550)]">메일주소</span>
            <div className="body2 text-[var(--color-grey-150)]">
              {customer.email}
            </div>
          </div>
          {customer.requestNotes && (
            <div className="flex gap-4">
              <span className="body2 text-[var(--color-grey-550)]">
                요청사항
              </span>
              <div className="body2 text-[var(--color-grey-150)]">
                {customer.requestNotes}
              </div>
            </div>
          )}
          {customer.memo && (
            <div className="flex gap-4">
              <span className="body2 text-[var(--color-grey-550)]">
                기타메모
              </span>
              <div className="body2 text-[var(--color-grey-150)]">
                {customer.memo}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

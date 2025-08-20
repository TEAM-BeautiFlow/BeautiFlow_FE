import ManagerNavbar from "../../../layout/ManagerNavbar";
import ClientHeader from "./components/ClientHeader";
import type { Reservations } from "../../../types/reservations";
import type { CustomerDetail } from "../../../types/customer";
import ReservationCard from "./components/ReservationCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getUserInfo } from "@/apis/mypage/mypage";

type LocationState = CustomerDetail & { allGroups?: string[] };

export default function ClientPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const id = Number(customerId);
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: LocationState };

  if (!Number.isFinite(id)) {
    return <div className="p-5 text-red-400">잘못된 고객 ID입니다.</div>;
  }

  // 고객 상세 상태
  const [customer, setCustomer] = useState<CustomerDetail | null>(
    state ?? null,
  );
  const [custLoading, setCustLoading] = useState(!state);
  const [custError, setCustError] = useState<string | null>(null);

  // 예약 상태
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [resError, setResError] = useState<string | null>(null);

  const userIdRef = useRef<number | null>(null);
  const shopIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userInfo = await getUserInfo();
        if (!cancelled) {
          userIdRef.current = userInfo.id;
          shopIdRef.current = userInfo.shopMembers?.[0]?.shopId ?? null;
          if (shopIdRef.current) {
            localStorage.setItem("shopId", String(shopIdRef.current));
          }
        }
      } catch (e) {
        console.error("failed to load user info", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  // 예약 GET
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setResLoading(true);
        setResError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setResLoading(false);
          setResError("로그인이 필요합니다.");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/${id}/reservations`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (cancelled) return;

        if (Array.isArray(res.data?.data)) {
          const mapped: Reservations[] = res.data.data.map((r: any) => ({
            reservationId: r.reservationId,
            imageUrl: typeof r.imageUrl === "string" ? r.imageUrl : "",
            shopName: r.shopName ?? "",
            designerName: r.designerName ?? "",
            treatmentName: r.treatmentName ?? "",
            optionNames: Array.isArray(r.optionNames) ? r.optionNames : [],
            date: r.date ?? "",
            time: r.time ?? "",
            status: r.status,
          }));
          setReservations(mapped);
        } else {
          console.warn("예약 리스트 응답이 배열이 아닙니다:", res.data);
          setReservations([]);
        }
      } catch (e) {
        console.error("예약 리스트 불러오기 실패", e);
        setResError("예약 정보를 불러오지 못했습니다.");
        setReservations([]);
      } finally {
        if (!cancelled) setResLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 화면 렌더링 가드
  if (custLoading && !customer) {
    return <div className="p-5 text-[var(--color-grey-550)]">불러오는 중…</div>;
  }
  if (!customer) {
    return (
      <div className="p-5 text-[var(--color-grey-550)]">
        {custError ?? "고객 정보를 찾을 수 없습니다."}
      </div>
    );
  }

  // 채팅방 입장
  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const shopId = shopIdRef.current;
      const designerId = userIdRef.current;

      if (!token || !designerId || !shopId) {
        console.error("정보가 부족합니다.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/rooms`,
        { shopId, customerId: customer.customerId, designerId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const roomId = response.data.data.roomId;
      navigate(`/chat/rooms/${roomId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("채팅방 생성 실패", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  };

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단바 */}
      <ClientHeader
        title="고객 관리"
        rightContent={
          <span className="label2 text-[var(--color-purple)]">수정</span>
        }
        onRightClick={() =>
          navigate(`/mangedCustomer/${customer.customerId}/modify`, {
            state: {
              ...customer,
              allGroups: state?.allGroups, // 리스트에서 전달된 allGroups 그대로 유지
            },
          })
        }
      />

      {/* 개인정보 */}
      <div className="px-5 pt-3 pb-10">
        {/* 이름 */}
        <div className="mb-2 flex justify-between">
          <span className="h0 text-[var(--color-grey-150)]">
            {customer.name}
          </span>
          <div className="cursor-pointer" onClick={handleCreateRoom}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200 hover:[&>path]:fill-[var(--color-purple)]"
            >
              <path
                d="M14 2.5C20.3513 2.5 25.5 7.64873 25.5 14C25.5 20.3513 20.3513 25.5 14 25.5C12.4722 25.5 11.0112 25.2019 9.6748 24.6592C9.55344 24.6099 9.4805 24.5801 9.42578 24.5596C9.37142 24.5392 9.36896 24.5405 9.38867 24.5449C9.37898 24.5427 9.37343 24.5414 9.37109 24.541H9.35156C9.34573 24.5416 9.3366 24.5431 9.32324 24.5449C9.27713 24.5512 9.21539 24.5616 9.10449 24.5801L4.95312 25.2715C4.75444 25.3046 4.5392 25.3416 4.35547 25.3555C4.167 25.3697 3.88319 25.3726 3.58594 25.2451C3.21258 25.085 2.91502 24.7874 2.75488 24.4141C2.62745 24.1168 2.63031 23.833 2.64453 23.6445C2.6584 23.4608 2.6954 23.2456 2.72852 23.0469L3.41992 18.8955C3.43841 18.7846 3.44883 18.7229 3.45508 18.6768C3.45689 18.6634 3.45838 18.6543 3.45898 18.6484V18.6289C3.45857 18.6266 3.45725 18.621 3.45508 18.6113C3.4595 18.631 3.46084 18.6286 3.44043 18.5742C3.41987 18.5195 3.39011 18.4466 3.34082 18.3252C2.79806 16.9888 2.5 15.5278 2.5 14C2.5 7.64873 7.64873 2.5 14 2.5ZM9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H18C18.5523 17 19 16.5523 19 16C19 15.4477 18.5523 15 18 15H9ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H9Z"
                fill="#8E8E8E"
              />
            </svg>
          </div>
        </div>

        {/* 그룹 */}
        <div className="body1 mb-4 text-[var(--color-grey-450)]">
          {!customer.groupCodes?.includes("전체") &&
            (customer.groupCodes ?? []).map(g => `#${g}`).join(" ")}
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

      <div className="h-[8px] w-[375px] bg-[var(--color-grey-950)]"></div>

      {/* 진행 시술 */}
      <div className="flex flex-col gap-2 py-7">
        <span className="label1 px-5 text-[var(--color-grey-150)]">
          진행 시술
        </span>

        {resLoading ? (
          <div className="body2 px-5 text-[var(--color-grey-550)]">
            불러오는 중…
          </div>
        ) : resError ? (
          <div className="body2 px-5 text-[var(--color-grey-550)]">
            {resError}
          </div>
        ) : reservations.length === 0 ? (
          <div className="body2 px-5 text-[var(--color-grey-550)]">
            예약이 없습니다.
          </div>
        ) : (
          reservations.map(reservation => (
            <ReservationCard
              key={reservation.reservationId}
              reservation={reservation}
            />
          ))
        )}
      </div>

      {/* 하단바 */}
      <ManagerNavbar />
    </div>
  );
}

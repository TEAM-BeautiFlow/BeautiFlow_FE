import { useLocation, useParams } from "react-router-dom";
import { useReservationContext } from "../../../context/ReservationContext";
import UserNavbar from "../../../layout/UserNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Reservation } from "../../../types/reservations";
import noImage from "../../../assets/no_image.png";
import { getUserInfo } from "@/apis/mypage/mypage";
import { api } from "@/apis/axiosInstance";

function formatOptionGroups(groupsInput: Reservation["optionGroups"]) {
  const groups = asArray(groupsInput);
  if (!groups || groups.length === 0) return "-";
  if (!groups.length) return "-";
  return groups
    .map(g => {
      const items = asArray(g?.optionItems)
        .map(i => i?.itemName?.trim())
        .filter(Boolean) as string[];
      return items.length
        ? `${g?.groupName ?? ""}(${items.join(", ")})`
        : (g?.groupName ?? "");
    })
    .filter(Boolean)
    .join(", ");
}

function asArray<T = any>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v == null) return [];
  if (typeof v === "string") {
    const s = v.trim();
    // JSON 문자열 형태면 파싱 시도
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    // 쉼표 구분 문자열이면 split
    if (s.includes(","))
      return s
        .split(",")
        .map(x => x.trim())
        .filter(Boolean) as T[];
    // 단일 문자열 1개만 온 경우
    return s ? [s as T] : [];
  }
  // 그 외 타입(객체/숫자)은 단일 원소 배열로 감싸기
  return [v as T];
}

const normalizeList = (res: any) =>
  Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];

const ALL_STATUSES = [
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export default function ReservationDetailPage() {
  const { reservationId } = useParams();
  const id = Number(reservationId);
  const location = useLocation(); // ★

  const { reservations: ctx } = useReservationContext();
  const fromState = (location.state as { reservation?: Reservation })
    ?.reservation;
  const fromContext = useMemo(
    () => ctx.find(r => r.reservationId === id),
    [ctx, id],
  );
  const [reservation, setReservation] = useState<Reservation | undefined>(
    fromState ?? fromContext,
  );
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (reservation) return; // 이미 있으면 스킵
    let aborted = false;

    (async () => {
      const results = await Promise.allSettled(
        ALL_STATUSES.map(s =>
          api.get(`/reservations/my-reservation`, { params: { status: s } }),
        ),
      );
      const merged: Reservation[] = results
        .filter(
          (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled",
        )
        .flatMap(r => normalizeList(r.value));
      const found = merged.find(r => r.reservationId === id);
      if (!aborted) setReservation(found);
    })().catch(err => {
      console.error("detail fallback fetch failed", err);
    });

    return () => {
      aborted = true;
    };
  }, [id, reservation]);

  // status 설정
  const statusLabels: Record<string, string> = {
    CONFIRMED: "예약 확정",
    PENDING: "예약 확인중",
    COMPLETED: "시술 완료",
    CANCELLED: "취소 완료",
    NO_SHOW: "노쇼",
  };

  // 뒤로가기
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 채팅방 입장
  const handleCreateRoom = async () => {
    const userInfo = await getUserInfo();

    try {
      const token = localStorage.getItem("accessToken");
      const customerId = userInfo.id;
      const shopId = reservation?.shopId;
      const designerId = reservation?.designerId;

      if (!token || !designerId || !shopId) {
        console.error("정보가 부족합니다.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/rooms`,
        {
          shopId,
          customerId,
          designerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const roomId = response.data.data.roomId;
      navigate(`/user/chat/rooms/${roomId}`, {
        state: {
          designerId,
          designerName: reservation.designerName,
          shopName: reservation.shopName,
        },
      });
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

  // 복사기능
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("주소가 복사되었습니다!");
    } catch (err) {
      alert("주소 복사에 실패했습니다.");
      console.error(err);
    }
  };

  // 매장 이미지
  const src =
    reservation?.shopImageUrl &&
    reservation.shopImageUrl.trim() &&
    reservation.shopImageUrl !== "null" &&
    reservation.shopImageUrl !== "undefined"
      ? reservation.shopImageUrl
      : noImage;

  // 예약 취소
  const handleCancelReservation = async (reservationId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access Token이 없습니다.");
      return;
    }
    try {
      setCancellingId(reservationId);

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/reservations/${reservationId}/cancel`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReservation(prev => (prev ? { ...prev, status: "CANCELLED" } : prev));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("예약 취소 실패", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        alert("예약 취소에 실패했습니다.");
      } else {
        console.error("알 수 없는 오류", error);
      }
    } finally {
      setCancellingId(null);
    }
  };

  if (!fromState && !fromContext && !reservation) {
    return <div className="p-4 text-white">예약 정보를 불러오는 중…</div>;
  }

  if (!reservation) {
    return <div className="p-4 text-white">예약 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto flex w-[375px] flex-col overflow-y-auto bg-[var(--color-grey-1000)]">
      {/* 상단 */}
      <div className="mt-14 flex h-[60px] items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-2.5">
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
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <span className="label1 text-[var(--color-grey-150)]">
            예약 상세내역
          </span>
        </div>
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
              fill="#6E6E6E"
            />
          </svg>
        </div>
      </div>

      {/* 매장 정보 */}
      <div className="mt-4 flex flex-col">
        <div className="flex h-[177px] flex-col gap-3 px-5 py-4">
          {/* status */}
          <span
            className={`body1 flex h-[21px] justify-between ${
              reservation.status === "CONFIRMED"
                ? "text-[#51C879]"
                : reservation.status === "PENDING"
                  ? "text-[var(--color-purple)]"
                  : reservation.status === "COMPLETED"
                    ? "text-[var(--color-grey-450)]"
                    : "text-[#D2636A]"
            }`}
          >
            {statusLabels[reservation.status]}
            <div className="flex gap-[10px]">
              <span
                className={`body2 cursor-pointer text-[var(--color-grey-550)] ${
                  reservation.status === "CONFIRMED" ||
                  reservation.status === "PENDING"
                    ? "block"
                    : "hidden"
                } ${cancellingId === reservation.reservationId ? "pointer-events-none opacity-50" : ""}`}
                onClick={() => {
                  if (cancellingId) return;
                  if (confirm("이 예약을 취소하시겠습니까?")) {
                    handleCancelReservation(reservation.reservationId);
                  }
                }}
              >
                {cancellingId === reservation.reservationId
                  ? "취소 중..."
                  : "취소하기"}
              </span>
            </div>
          </span>

          {/* 가게 정보 */}
          <div className="flex h-[112px] gap-4">
            {/* 왼쪽 이미지 */}
            <div className="h-25 w-25 shrink-0 rounded-[4px] bg-white">
              <img src={src} className="h-full w-full object-cover" />
            </div>
            {/* 오른쪽 내용 */}
            <div className="flex-col justify-between">
              {/* 가게명 */}
              <div className="label1 line-clamp-2 text-[var(--color-grey-150)]">
                {reservation.shopName}
              </div>
              {/* 주소 */}
              <div className="flex h-[36px]">
                <div className="caption2 text-[var(--color-grey-550)]">
                  {reservation.shopAddress}
                  <button
                    onClick={() => copyToClipboard(reservation.shopAddress)}
                    className="ml-1 inline-flex translate-y-1 cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.6 5.6V3.92C5.6 3.24794 5.6 2.91191 5.73079 2.65521C5.84584 2.42942 6.02942 2.24584 6.25521 2.13079C6.51191 2 6.84794 2 7.52 2H12.08C12.7521 2 13.0881 2 13.3448 2.13079C13.5706 2.24584 13.7542 2.42942 13.8692 2.65521C14 2.91191 14 3.24794 14 3.92V8.48C14 9.15206 14 9.4881 13.8692 9.74479C13.7542 9.97058 13.5706 10.1542 13.3448 10.2692C13.0881 10.4 12.7521 10.4 12.08 10.4H10.4M3.92 14H8.48C9.15206 14 9.48809 14 9.74479 13.8692C9.97058 13.7542 10.1542 13.5706 10.2692 13.3448C10.4 13.0881 10.4 12.7521 10.4 12.08V7.52C10.4 6.84794 10.4 6.51191 10.2692 6.25521C10.1542 6.02942 9.97058 5.84584 9.74479 5.73079C9.48809 5.6 9.15206 5.6 8.48 5.6H3.92C3.24794 5.6 2.91191 5.6 2.65521 5.73079C2.42942 5.84584 2.24584 6.02942 2.13079 6.25521C2 6.51191 2 6.84794 2 7.52V12.08C2 12.7521 2 13.0881 2.13079 13.3448C2.24584 13.5706 2.42942 13.7542 2.65521 13.8692C2.91191 14 3.24794 14 3.92 14Z"
                        stroke="#B270EA"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="">
        {/* 제목 */}
        <div className="label1 px-5 py-3 text-[var(--color-grey-150)]">
          예약 정보
        </div>
        {/* 테이블 */}
        <div className="mx-[20.5px] border border-[var(--color-grey-850)]">
          {/* 항목들 */}
          {[
            {
              label: "시술일시",
              value: `${reservation.reservationDate} • ${reservation.startTime}`,
            },
            {
              label: "소요시간",
              value: (reservation.totalDurationMinutes ?? 0) + "분",
            },
            {
              label: "시술가격",
              value: (reservation.totalPrice ?? 0) + "원",
            },
            { label: "매장이름", value: reservation.shopName },
            { label: "시술자명", value: reservation.designerName },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-5 border-b border-[var(--color-grey-850)] px-4 py-2 last:border-none"
            >
              <span className="body2 text-[var(--color-grey-550)]">
                {item.label}
              </span>
              <span className="body2 text-[var(--color-grey-150)]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 시술정보 */}
      <div className="mt-5">
        {/* 제목 */}
        <div className="label1 px-5 py-3 text-[var(--color-grey-150)]">
          시술 정보
        </div>

        {/* 시술 리스트 */}
        {(asArray<string>(reservation.treatments).length
          ? asArray<any>(reservation.treatments)
          : []
        ).map(
          (
            item,
            idx, // ★ treatments 가드
          ) => (
            <div
              key={idx}
              className="mb-4 flex h-[77px] items-start gap-4 px-5"
            >
              <div className="h-[77px] w-[77px] rounded-[4px] bg-white">
                <img
                  src={asArray<string>(item?.treatmentImageUrls)[0] || noImage} // ★ 여기
                  className="h-full w-full object-cover"
                />
              </div>
              {/* 오른쪽 내용 */}
              <div className="flex h-[77px] w-[243px] flex-col justify-between">
                <div className="">
                  {/* 시술명 + 가격 */}
                  <div className="flex h-[49px] flex-col">
                    <div className="label1 flex justify-between gap-1 text-[var(--color-grey-450)]">
                      {item.treatmentName}
                      {/* 소요시간 */}
                      <div className="caption1 inline-flex h-[26px] items-center gap-1 self-end rounded-[6px] bg-[var(--color-grey-850)] px-1.5 py-1 text-[var(--color-grey-450)]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.1333 7.66667L13.8004 9L12.4666 7.66667M13.9634 8.66667C13.9876 8.44778 14 8.22534 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C9.88484 14 11.5667 13.1309 12.6667 11.7716M8 4.66667V8L10 9.33333"
                            stroke="#BDBEBD"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        {item.treatmentDurationMinutes ?? 0}분
                      </div>
                    </div>
                    <div className="body1 text-[var(--color-grey-250)]">
                      {item.treatmentPrice ?? 0}원
                    </div>
                  </div>
                </div>
                {/* 옵션 */}
                <div className="caption1 mb-[6px] line-clamp-2 text-[var(--color-grey-650)]">
                  {formatOptionGroups(reservation.optionGroups)}
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* 요청사항 */}
      <div className="mt-3 mb-10 ml-5">
        {/* 제목 */}
        <div className="label1 py-3 text-[var(--color-grey-150)]">요청사항</div>
        {/* 이미지 목록 */}
        <div className="hide-scrollbar flex gap-1.5 overflow-x-auto">
          {asArray<string>(reservation.styleImageUrls).map(
            (
              url,
              index, // ★ 여기
            ) => (
              <div
                key={index}
                className="h-20 w-20 min-w-[80px] overflow-hidden rounded-[4px] bg-white"
              >
                <img
                  src={url}
                  alt={`style-${index}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ),
          )}
        </div>

        {/* 요청사항 텍스트 박스 */}
        <div className="body2 mt-4 mr-5 mb-20 h-[116px] w-[330px] rounded-[8px] bg-[var(--color-grey-950)] p-4 text-[var(--color-grey-150)]">
          {reservation.requestNotes}
        </div>
      </div>
      <UserNavbar />
    </div>
  );
}

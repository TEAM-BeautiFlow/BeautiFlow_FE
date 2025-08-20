import { Outlet, useLocation } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../types/reservations";
import { useEffect, useState } from "react";
// 기존 axios 대신 공통 인스턴스 사용 권장 (토큰/헤더 일관)
import { api } from "@/apis/axiosInstance";
const PREFETCH_ENABLED = false;
export default function ReservationWrapper() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (!PREFETCH_ENABLED) return;
    const controller = new AbortController();

    async function fetchAll() {
      // 모든 상태 한 번에 프리페치(컨텍스트 폴백용)
      const statuses = [
        "CONFIRMED",
        "PENDING",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ] as const;

      const results = await Promise.allSettled(
        statuses.map(s =>
          // URL에 직접 붙여 안전하게
          api.get(
            `/reservations/my-reservation?status=${encodeURIComponent(s)}`,
            {
              signal: controller.signal,
            },
          ),
        ),
      );

      const items = results
        .filter(
          (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled",
        )
        .flatMap(r =>
          Array.isArray(r.value?.data?.data) ? r.value.data.data : [],
        );

      // 중복 제거 (reservationId 기준)
      const uniq = Array.from(
        new Map(items.map(r => [r.reservationId, r])).values(),
      );

      setReservations(uniq);
    }

    // 고객 전용 라우트에서만 프리페치
    if (location.pathname.startsWith("/reservations")) {
      fetchAll().catch(err => {
        const code = (err as any)?.code || (err as any)?.name;
        if (code === "ERR_CANCELED" || code === "CanceledError") return;
        console.error("프리페치 실패:", err);
        setReservations([]); // 폴백
      });
    }

    return () => controller.abort();
  }, [location.pathname]);

  return (
    <ReservationContext.Provider value={{ reservations }}>
      <Outlet />
    </ReservationContext.Provider>
  );
}

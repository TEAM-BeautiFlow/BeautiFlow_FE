import { Outlet } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../types/reservations";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReservationWrapper() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/reservations/my-reservation`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          setReservations(response.data.data);
        } else {
          console.log(response.data.data);
          setReservations([]);
        }
      } catch (err) {
        console.error("GET /reservations/my-reservation 실패:");
        setReservations([]);
      }
    };

    // 현재 경로가 고객 전용 라우트일 때만 로딩 (매니저 상세 진입 시 트리거 방지)
    if (location.pathname.startsWith("/reservations")) {
      fetchReservations();
    }
  }, []);
  return (
    <ReservationContext.Provider value={{ reservations }}>
      <Outlet />
    </ReservationContext.Provider>
  );
}

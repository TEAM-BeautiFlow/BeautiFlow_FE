import ManagerNavbar from "../../../layout/ManagerNavbar";
import ClientHeader from "./components/ClientHeader";
import type { Reservation } from "../../../types/reservations";
import ReservationCard from "./components/ReservationCard";
import { useNavigate } from "react-router-dom";

const dummyReservations: Reservation[] = [
  {
    reservationId: 1,
    status: "예약 확정",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.07.06 · 오후 1시",
  },
  {
    reservationId: 2,
    status: "시술 완료",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.08.01 · 오후 3시",
  },
];

export default function ClientPage() {
  //   const { reservations } = useReservationContext();
  //   const selectedCustomerId = 1; // 바꿔야함
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단바 */}
      <ClientHeader
        title="고객 관리"
        rightContent={
          <span className="label2 text-[var(--color-purple)]">수정</span>
        }
        onRightClick={() => navigate("/client/page/modify")}
      />

      {/* 개인정보 */}
      <div className="px-5 pt-3 pb-10">
        <div className="flex justify-between">
          <span className="h0 text-[var(--color-grey-150)]">손하늘</span>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2.5C20.3513 2.5 25.5 7.64873 25.5 14C25.5 20.3513 20.3513 25.5 14 25.5C12.4722 25.5 11.0112 25.2019 9.6748 24.6592C9.55344 24.6099 9.4805 24.5801 9.42578 24.5596C9.37142 24.5392 9.36896 24.5405 9.38867 24.5449C9.37898 24.5427 9.37343 24.5414 9.37109 24.541H9.35156C9.34573 24.5416 9.3366 24.5431 9.32324 24.5449C9.27713 24.5512 9.21539 24.5616 9.10449 24.5801L4.95312 25.2715C4.75444 25.3046 4.5392 25.3416 4.35547 25.3555C4.167 25.3697 3.88319 25.3726 3.58594 25.2451C3.21258 25.085 2.91502 24.7874 2.75488 24.4141C2.62745 24.1168 2.63031 23.833 2.64453 23.6445C2.6584 23.4608 2.6954 23.2456 2.72852 23.0469L3.41992 18.8955C3.43841 18.7846 3.44883 18.7229 3.45508 18.6768C3.45689 18.6634 3.45838 18.6543 3.45898 18.6484V18.6289C3.45857 18.6266 3.45725 18.621 3.45508 18.6113C3.4595 18.631 3.46084 18.6286 3.44043 18.5742C3.41987 18.5195 3.39011 18.4466 3.34082 18.3252C2.79806 16.9888 2.5 15.5278 2.5 14C2.5 7.64873 7.64873 2.5 14 2.5ZM9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H18C18.5523 17 19 16.5523 19 16C19 15.4477 18.5523 15 18 15H9ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H9Z"
              fill="#8E8E8E"
            />
          </svg>
        </div>
        <div className="mt-[47px] inline-flex flex-col gap-[6px]">
          <div className="flex gap-4">
            <span className="body2 text-[var(--color-grey-550)]">전화번호</span>
            <div className="body2 text-[var(--color-grey-150)]">
              010-1234-5678
            </div>
          </div>
          <div className="flex gap-4">
            <span className="body2 text-[var(--color-grey-550)]">메일주소</span>
            <div className="body2 text-[var(--color-grey-150)]">
              handsson@ewhain.net
            </div>
          </div>
        </div>
      </div>

      <div className="h-[8px] w-[375px] bg-[var(--color-grey-950)]"></div>

      {/* 진행시술 */}
      <div className="flex flex-col gap-2 py-7">
        <span className="label1 px-5 text-[var(--color-grey-150)]">
          진행 시술
        </span>
        {dummyReservations.map(reservation => (
          <ReservationCard
            key={reservation.reservationId}
            reservation={reservation}
          />
        ))}{" "}
      </div>

      {/* 하단바 */}
      <ManagerNavbar />
    </div>
  );
}

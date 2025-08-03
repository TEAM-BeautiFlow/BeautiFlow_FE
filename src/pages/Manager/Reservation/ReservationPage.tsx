import ReservationSummary from "./components/ReservationSummary.tsx";
import ReservationCalendar from "./components/ReservationCalendar.tsx";
import ReservationList from "./components/ReservationList.tsx";

export default function ReservationPage() {
  return (
    <div className="flex min-h-[812px] min-w-[360px] flex-col items-center justify-center">
      <div className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-hidden bg-[#181818] px-5 py-6">
        {/* 오늘의 예약 요약 */}
        <ReservationSummary />
        {/* 전체 예약 캘린더 */}
        <ReservationCalendar />
        {/* 선택 날짜 예약 리스트 (스크롤 가능) */}
        <ReservationList />
      </div>
    </div>
  );
}

const days = ["일", "월", "화", "수", "목", "금", "토"];

export default function ReservationCalendar() {
  // 임시로 2025년 6월 달력 하드코딩
  const year = 2025;
  const month = 6;
  const daysInMonth = 30;
  const firstDay = 0; // 일요일 시작
  const today = 25;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-[20px] font-bold">전체 예약</h2>
      <div className="mb-3 flex items-center justify-center">
        <button className="cursor-pointer border-none bg-none text-2xl text-white">
          {"<"}
        </button>
        <span className="mx-4 text-[18px]">{`${year}년 ${month}월`}</span>
        <button className="cursor-pointer border-none bg-none text-2xl text-white">
          {">"}
        </button>
      </div>
      <div className="mb-2 flex justify-between">
        {days.map(d => (
          <div key={d} className="w-8 text-center text-[15px] text-gray-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[16px] font-${isToday ? "bold" : "normal"} ${isToday ? "bg-neutral-800 text-white" : "text-white"}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </section>
  );
}

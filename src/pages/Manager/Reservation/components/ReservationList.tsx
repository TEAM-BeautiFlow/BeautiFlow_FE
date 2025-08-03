const reservations = [
  {
    id: 1,
    status: "예약 확정",
    time: "09:30 - 10:30",
    name: "이달의 네일",
    option: "옵션명 (네일 보수)",
    user: "손하늘",
  },
  {
    id: 2,
    status: "예약 확정",
    time: "11:00 - 12:30",
    name: "이달의 네일",
    option: "옵션명 (네일 보수)",
    user: "손하늘",
  },
];

export default function ReservationList() {
  return (
    <section className="mt-6">
      <div className="mb-4 text-[17px] font-semibold">25일 수</div>
      <div className="max-h-80 overflow-y-auto pr-1">
        {reservations.map(r => (
          <div
            key={r.id}
            className="mb-4 flex flex-col gap-2 rounded-xl bg-[#232323] p-4"
          >
            <div className="text-[15px] font-bold text-[#4be36a]">
              {r.status}
            </div>
            <div className="text-[22px] font-bold">{r.time}</div>
            <div className="text-[15px] text-gray-400">
              {r.name} | {r.option}
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[15px] text-gray-400">{r.user}</span>
              <span className="text-[18px]">💬</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

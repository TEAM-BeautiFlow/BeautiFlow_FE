const summaryData = [
  { label: "확정 대기", value: 12 },
  { label: "당일 완료", value: 12 },
  { label: "당일 취소", value: 12 },
];

export default function ReservationSummary() {
  return (
    <section className="mb-8">
      <h2 className="mb-5 text-[22px] font-bold">오늘의 예약</h2>
      <div className="mx-auto flex max-w-[320px] justify-between">
        {summaryData.map(item => (
          <div key={item.label} className="text-center">
            <div className="mb-1 text-[28px] font-bold">{item.value}</div>
            <div className="text-[16px]">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

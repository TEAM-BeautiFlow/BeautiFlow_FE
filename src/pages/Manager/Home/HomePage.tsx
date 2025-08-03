import LeftChevronIcon from "../../../assets/icon_left-chevron.svg";
import RightChevronIcon from "../../../assets/icon_right-chevron.svg";

const TodaysReservationCard = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => (
  <div className="flex flex-col justify-between rounded-lg bg-[#1E1E1E] p-4">
    <div className="flex items-center justify-between text-gray-400">
      <span className="text-sm font-medium">{title}</span>
      <img src={RightChevronIcon} alt=">" className="h-4 w-4" />
    </div>
    <span className="mt-2 text-3xl font-bold text-white">{count}</span>
  </div>
);

const Calendar = () => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  // Dummy calendar days for layout
  const dates = [
    null,
    null,
    null,
    null,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    null,
  ];

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <button>
          <img src={LeftChevronIcon} alt="<" className="h-6 w-6" />
        </button>
        <h3 className="text-lg font-bold text-white">2025년 6월</h3>
        <button>
          <img src={RightChevronIcon} alt=">" className="h-6 w-6" />
        </button>
      </div>
      <div className="mb-4 grid grid-cols-7 text-center text-sm text-gray-500">
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 items-center gap-y-4 text-center text-sm">
        {dates.map((date, index) => (
          <div key={index} className="flex h-8 items-center justify-center">
            {date && (
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  date === 25 ? "bg-[#3A3A3A] text-white" : "text-gray-400"
                }`}
              >
                {date}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ReservationItem = ({
  status,
  time,
  customer,
  service,
}: {
  status: string;
  time: string;
  customer: string;
  service: string;
}) => (
  <div className="border-t border-gray-800 pt-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-bold text-[#A465FD]">{status}</p>
        <div className="my-1 flex items-center">
          <svg
            className="mr-2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-lg font-bold text-white">{time}</p>
        </div>
        <button className="flex items-center text-sm text-gray-400">
          {customer} | {service}
          <img src={RightChevronIcon} alt=">" className="ml-1 h-4 w-4" />
        </button>
      </div>
      <button className="flex items-center rounded-lg bg-[#3A3A3A] px-4 py-2 text-sm whitespace-nowrap text-white">
        채팅
        <img src={RightChevronIcon} alt=">" className="ml-1 h-4 w-4" />
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const reservations = [
    {
      status: "예약 확정",
      time: "09:30 - 10:30",
      customer: "손하늘",
      service: "이달의 아트",
    },
    {
      status: "예약 확정",
      time: "11:00 - 12:30",
      customer: "손하늘",
      service: "시술명",
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-[375px] bg-black px-4 pb-24 text-white">
      <main className="flex flex-col gap-8 pt-6">
        <section>
          <h2 className="mb-4 text-xl font-bold">오늘의 예약</h2>
          <div className="grid grid-cols-3 gap-3">
            <TodaysReservationCard title="확정 대기" count={12} />
            <TodaysReservationCard title="당일 완료" count={12} />
            <TodaysReservationCard title="당일 취소" count={12} />
          </div>
        </section>

        <section className="border-t border-gray-800 pt-8">
          <h2 className="mb-4 text-xl font-bold">전체 예약</h2>
          <Calendar />
        </section>

        <section>
          <h3 className="mb-4 text-lg font-bold">25일 수</h3>
          <div className="space-y-4">
            {reservations.map((res, index) => (
              <ReservationItem key={index} {...res} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

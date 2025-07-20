import { useParams } from "react-router-dom";
import { useReservationContext } from "../../../context/ReservationContext";
import UserNavbar from "../../../layout/UserNavbar";
import { useNavigate } from "react-router-dom";

export default function ReservationDetailPage() {
  const { reservationId } = useParams();
  const { reservations } = useReservationContext();

  const id = Number(reservationId);
  const reservation = reservations.find(r => r.reservationId === id);

  // 뒤로가기
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
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

  if (!reservation) {
    return <div className="p-4 text-white">예약 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex w-[375px] flex-col overflow-y-auto bg-[var(--color-grey-1000)]">
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
        <div className="w-6"></div>
      </div>

      {/* 매장 정보 */}
      <div className="mt-4 flex flex-col">
        <div className="flex h-[177px] flex-col gap-3 px-5 py-4">
          {/* 상태에 따라 색상 변경 */}
          <span
            className={`body1 flex h-[21px] justify-between ${
              reservation.status === "예약 확정"
                ? "text-[#51C879]"
                : reservation.status === "예약 확인중"
                  ? "text-[var(--color-purple)]"
                  : reservation.status === "시술 완료"
                    ? "text-[var(--color-grey-450)]"
                    : "text-[#D2636A]"
            }`}
          >
            {reservation.status}
            <div className="flex gap-[10px]">
              <svg
                className="translate-y-[-7px]"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2.5C20.3513 2.5 25.5 7.64873 25.5 14C25.5 20.3513 20.3513 25.5 14 25.5C12.4722 25.5 11.0112 25.2019 9.6748 24.6592C9.55344 24.6099 9.4805 24.5801 9.42578 24.5596C9.37142 24.5392 9.36896 24.5405 9.38867 24.5449C9.37898 24.5427 9.37343 24.5414 9.37109 24.541H9.35156C9.34573 24.5416 9.3366 24.5431 9.32324 24.5449C9.27713 24.5512 9.21539 24.5616 9.10449 24.5801L4.95312 25.2715C4.75444 25.3046 4.5392 25.3416 4.35547 25.3555C4.167 25.3697 3.88319 25.3726 3.58594 25.2451C3.21258 25.085 2.91502 24.7874 2.75488 24.4141C2.62745 24.1168 2.63031 23.833 2.64453 23.6445C2.6584 23.4608 2.6954 23.2456 2.72852 23.0469L3.41992 18.8955C3.43841 18.7846 3.44883 18.7229 3.45508 18.6768C3.45689 18.6634 3.45838 18.6543 3.45898 18.6484V18.6289C3.45857 18.6266 3.45725 18.621 3.45508 18.6113C3.4595 18.631 3.46084 18.6286 3.44043 18.5742C3.41987 18.5195 3.39011 18.4466 3.34082 18.3252C2.79806 16.9888 2.5 15.5278 2.5 14C2.5 7.64873 7.64873 2.5 14 2.5ZM9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H18C18.5523 17 19 16.5523 19 16C19 15.4477 18.5523 15 18 15H9ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H9Z"
                  fill="#6E6E6E"
                />
              </svg>
              <span className="body2 h-[21px] text-[var(--color-grey-550)]">
                취소하기
              </span>
            </div>
          </span>
          <div className="flex h-[112px] gap-4">
            {/* 왼쪽 이미지 */}
            <div className="h-25 w-25 shrink-0 rounded-[4px] bg-white"></div>

            {/* 오른쪽 내용 */}
            <div className="flex-col justify-between">
              {/* 가게명 */}
              <div className="label1 line-clamp-2 text-[var(--color-grey-150)]">
                {reservation.shopname}
              </div>
              {/* 주소 */}
              <div className="flex h-[36px]">
                <div className="caption2 text-[var(--color-grey-550)]">
                  {reservation.address}
                  <button
                    onClick={() => copyToClipboard(reservation.address)}
                    className="ml-1 inline-flex translate-y-1"
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
            { label: "시술일시", value: reservation.date },
            {
              label: "소요시간",
              value: (
                <div className="flex items-center gap-[145px]">
                  <span>1시간 30분</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 29 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[var(--color-purple)]"
                  >
                    <path
                      d="M14.5 2.5C20.8513 2.5 26 7.64873 26 14C26 20.3513 20.8513 25.5 14.5 25.5C12.9722 25.5 11.5112 25.2019 10.1748 24.6592C10.0534 24.6099 9.9805 24.5801 9.92578 24.5596C9.87142 24.5392 9.86896 24.5405 9.88867 24.5449C9.87898 24.5427 9.87343 24.5414 9.87109 24.541H9.85156C9.84573 24.5416 9.8366 24.5431 9.82324 24.5449C9.77713 24.5512 9.71539 24.5616 9.60449 24.5801L5.45312 25.2715C5.25444 25.3046 5.0392 25.3416 4.85547 25.3555C4.667 25.3697 4.38319 25.3726 4.08594 25.2451C3.71258 25.085 3.41502 24.7874 3.25488 24.4141C3.12745 24.1168 3.13031 23.833 3.14453 23.6445C3.1584 23.4608 3.1954 23.2456 3.22852 23.0469L3.91992 18.8955C3.93841 18.7846 3.94883 18.7229 3.95508 18.6768C3.95689 18.6634 3.95838 18.6543 3.95898 18.6484V18.6289C3.95857 18.6266 3.95725 18.621 3.95508 18.6113C3.9595 18.631 3.96084 18.6286 3.94043 18.5742C3.91987 18.5195 3.89011 18.4466 3.84082 18.3252C3.29806 16.9888 3 15.5278 3 14C3 7.64873 8.14873 2.5 14.5 2.5ZM9.5 15C8.94772 15 8.5 15.4477 8.5 16C8.5 16.5523 8.94772 17 9.5 17H18.5C19.0523 17 19.5 16.5523 19.5 16C19.5 15.4477 19.0523 15 18.5 15H9.5ZM9.5 11C8.94772 11 8.5 11.4477 8.5 12C8.5 12.5523 8.94772 13 9.5 13H15.5C16.0523 13 16.5 12.5523 16.5 12C16.5 11.4477 16.0523 11 15.5 11H9.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              ),
            },
            { label: "매장이름", value: reservation.shopname },
            { label: "예약자명", value: reservation.name },
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
        {[
          {
            title: reservation.title,
            price: "34,000원",
            time: "소요시간 | 60분",
          },
          {
            title: reservation.title,
            price: "34,000원",
            time: "소요시간 | 60분",
          },
        ].map((item, idx) => (
          <div key={idx} className="mb-4 flex h-[77px] items-start gap-4 px-5">
            {/* 썸네일 */}
            <div className="h-[77px] w-[77px] rounded-[4px] bg-white"></div>

            {/* 텍스트 + 시간 */}
            <div className="flex h-[49px] w-[243px] flex-col justify-between">
              {/* 시술명 + 가격 */}
              <div>
                <div className="label1 text-[var(--color-grey-450)]">
                  {item.title}
                </div>
                <div className="body1 mt-1 text-[var(--color-grey-250)]">
                  {item.price}
                </div>
              </div>
              {/* 소요시간 */}
              <div className="caption1 inline-flex h-[26px] w-[110px] items-center gap-1 self-end rounded-[6px] bg-[var(--color-grey-850)] px-1.5 py-1 text-[var(--color-grey-450)]">
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
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 요청사항 */}
      <div className="mt-3 mb-10 ml-5">
        {/* 제목 */}
        <div className="label1 py-3 text-[var(--color-grey-150)]">요청사항</div>
        {/* 이미지 목록 */}
        <div className="hide-scrollbar flex gap-1.5 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 w-20 min-w-[80px] rounded-[4px] bg-white"
            >
              {/* 여기에 이미지 삽입 가능 */}
            </div>
          ))}
        </div>

        {/* 요청사항 텍스트 박스 */}

        <textarea
          className="body2 mt-4 mr-5 mb-20 w-[330px] resize-none rounded-[8px] bg-[var(--color-grey-950)] p-4 text-[var(--color-grey-150)]"
          rows={4} // 원하는 줄 수
          placeholder="최대한 빠른 시술 부탁드립니다."
        />
      </div>
      <UserNavbar />
    </div>
  );
}

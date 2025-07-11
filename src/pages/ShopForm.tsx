export default function ShopForm() {
  return (
    <div className="mx-auto flex h-full w-screen flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 네비게이션 */}
      <div className="mt-14 flex h-[60px] items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <button>
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
          <span className="label1 text-[var(--color-grey-150)]">매장 정보</span>
        </div>
        <div className="label2 text-[var(--color-light-purple)]">저장</div>
      </div>

      {/* 업체명 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          업체명
        </label>
        <input
          type="text"
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="50자 내로 ~"
        />
      </div>

      {/* 매장 연락처 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          매장 연락처
        </label>
        <input
          type="text"
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="하이픈(-)을 넣어 입력해주세요."
        />
      </div>

      {/* 관련 링크 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          관련 링크
        </label>
        <input
          type="text"
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="운영하고 있는 SNS나 관련 링크를 입력해주세요."
        />
      </div>

      {/* 입금처 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          입금처{" "}
          <span className="caption1 text-[var(--color-grey-550)]">
            (optional)
          </span>
          <span className="caption1 mt-1.5 block text-xs text-[var(--color-grey-550)]">
            예약금을 받을 계좌번호를 입력해주세요.
          </span>
        </label>

        <input
          type="text"
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="ex) 신한 110-123-456789 예금주명"
        />
      </div>

      {/* 매장 위치 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          매장 위치
        </label>
        <textarea
          rows={2}
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="시설이 이루어지는 장소를 적어주세요."
        />
      </div>

      {/* 한 줄 소개 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          한 줄 소개{" "}
          <span className="caption1 text-[var(--color-grey-550)]">
            (optional)
          </span>
        </label>
        <textarea
          rows={4}
          className="caption1 h-[90px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="50자 내로 ~"
        />
      </div>

      {/* 대표 사진 */}
      <div className="mb-3 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          대표 사진
          <span className="caption1 mt-1.5 block text-xs text-[var(--color-grey-550)]">
            고객이 매장 페이지 진입시 처음으로 만나는 이미지예요. (권장 규격 및
            크기 - 16:9, 00MB 이상)
          </span>
        </label>
        <button className="flex h-20 w-20 flex-col items-center justify-center gap-[6px] rounded-[4px] border border-[var(--color-grey-650)] bg-[var(--color-grey-950)] text-[var(--color-grey-650)]">
          <svg
            className="translate-y-0.5"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00033 2.16669V13.8334M2.16699 8.00002H13.8337"
              stroke="#8E8E8E"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="caption2 translate-y-0.5 text-[var(--color-grey-450)]">
            사진 1/5
          </span>
        </button>
      </div>

      {/* 예약금 */}
      <div className="mb-10 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          예약금
        </label>
        <input
          type="text"
          className="caption1 h-[45px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="노쇼를 방지하기 위한 예약금을 설정해 주세요."
        />
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="bottom-0 left-0 w-full border-t border-[var(--color-grey-850)] bg-[var(--color-grey-1000)] px-7 py-5">
        <div className="flex justify-around">
          {/* 예약 */}
          <div className="flex flex-col items-center text-[var(--color-grey-650)]">
            {/* 예약 아이콘 */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.001 1.33301C20.9961 1.33345 26.6668 7.0048 26.667 14C26.6668 20.9952 20.9961 26.6656 14.001 26.666C7.00548 26.666 1.33416 20.9955 1.33398 14C1.33415 7.00453 7.00547 1.33301 14.001 1.33301ZM14 6C13.4477 6 13 6.44772 13 7V14.5889L13.5146 14.874L18.0146 17.374L18.1064 17.4189C18.5721 17.619 19.1226 17.4379 19.374 16.9854C19.6254 16.5327 19.4884 15.9692 19.0723 15.6797L18.9854 15.626L15 13.4111V7C15 6.44772 14.5523 6 14 6Z"
                fill="currentColor"
              />
            </svg>
            <span className="caption1 mt-1">예약</span>
          </div>

          {/* 고객 */}
          <div className="flex flex-col items-center text-[var(--color-grey-650)]">
            {/* 고객 아이콘 */}
            <svg
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7502 17.5C11.0517 17.5 7.76275 19.2857 5.66881 22.057C5.21814 22.6534 4.9928 22.9516 5.00018 23.3547C5.00587 23.666 5.20141 24.0589 5.44641 24.2511C5.76354 24.5 6.203 24.5 7.08192 24.5H22.4184C23.2973 24.5 23.7368 24.5 24.0539 24.2511C24.2989 24.0589 24.4944 23.666 24.5001 23.3547C24.5075 22.9516 24.2822 22.6534 23.8315 22.057C21.7376 19.2857 18.4486 17.5 14.7502 17.5Z"
                fill="#6E6E6E"
              />
              <path
                d="M14.7502 14C17.6496 14 20.0002 11.6495 20.0002 8.75C20.0002 5.8505 17.6496 3.5 14.7502 3.5C11.8507 3.5 9.50015 5.8505 9.50015 8.75C9.50015 11.6495 11.8507 14 14.7502 14Z"
                fill="#6E6E6E"
              />
              <path
                d="M14.7502 17.5C11.0517 17.5 7.76275 19.2857 5.66881 22.057C5.21814 22.6534 4.9928 22.9516 5.00018 23.3547C5.00587 23.666 5.20141 24.0589 5.44641 24.2511C5.76354 24.5 6.203 24.5 7.08192 24.5H22.4184C23.2973 24.5 23.7368 24.5 24.0539 24.2511C24.2989 24.0589 24.4944 23.666 24.5001 23.3547C24.5075 22.9516 24.2822 22.6534 23.8315 22.057C21.7376 19.2857 18.4486 17.5 14.7502 17.5Z"
                stroke="#6E6E6E"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.7502 14C17.6496 14 20.0002 11.6495 20.0002 8.75C20.0002 5.8505 17.6496 3.5 14.7502 3.5C11.8507 3.5 9.50015 5.8505 9.50015 8.75C9.50015 11.6495 11.8507 14 14.7502 14Z"
                stroke="#6E6E6E"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>{" "}
            <span className="caption1 mt-1">고객</span>
          </div>

          {/* 채팅 (활성화) */}
          <div className="flex flex-col items-center text-[var(--color-grey-650)]">
            {/* 채팅 아이콘 */}
            <svg
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 2.5C20.8513 2.5 26 7.64873 26 14C26 20.3513 20.8513 25.5 14.5 25.5C12.9722 25.5 11.5112 25.2019 10.1748 24.6592C10.0534 24.6099 9.9805 24.5801 9.92578 24.5596C9.87142 24.5392 9.86896 24.5405 9.88867 24.5449C9.87898 24.5427 9.87343 24.5414 9.87109 24.541H9.85156C9.84573 24.5416 9.8366 24.5431 9.82324 24.5449C9.77713 24.5512 9.71539 24.5616 9.60449 24.5801L5.45312 25.2715C5.25444 25.3046 5.0392 25.3416 4.85547 25.3555C4.667 25.3697 4.38319 25.3726 4.08594 25.2451C3.71258 25.085 3.41502 24.7874 3.25488 24.4141C3.12745 24.1168 3.13031 23.833 3.14453 23.6445C3.1584 23.4608 3.1954 23.2456 3.22852 23.0469L3.91992 18.8955C3.93841 18.7846 3.94883 18.7229 3.95508 18.6768C3.95689 18.6634 3.95838 18.6543 3.95898 18.6484V18.6289C3.95857 18.6266 3.95725 18.621 3.95508 18.6113C3.9595 18.631 3.96084 18.6286 3.94043 18.5742C3.91987 18.5195 3.89011 18.4466 3.84082 18.3252C3.29806 16.9888 3 15.5278 3 14C3 7.64873 8.14873 2.5 14.5 2.5ZM9.5 15C8.94772 15 8.5 15.4477 8.5 16C8.5 16.5523 8.94772 17 9.5 17H18.5C19.0523 17 19.5 16.5523 19.5 16C19.5 15.4477 19.0523 15 18.5 15H9.5ZM9.5 11C8.94772 11 8.5 11.4477 8.5 12C8.5 12.5523 8.94772 13 9.5 13H15.5C16.0523 13 16.5 12.5523 16.5 12C16.5 11.4477 16.0523 11 15.5 11H9.5Z"
                fill="#6E6E6E"
              />
            </svg>

            <span className="caption1 mt-1">채팅</span>
          </div>

          {/* 매장 */}
          <div className="flex flex-col items-center text-[var(--color-light-purple)]">
            {/* 매장 아이콘 */}
            <svg
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.396 3.22467C14.9861 2.90587 14.7812 2.74647 14.5549 2.6852C14.3552 2.63114 14.1448 2.63114 13.9451 2.6852C13.7188 2.74647 13.5139 2.90587 13.104 3.22466L5.19129 9.37898C4.66236 9.79037 4.39789 9.99606 4.20736 10.2537C4.03859 10.4819 3.91287 10.7389 3.83637 11.0122C3.75 11.3208 3.75 11.6558 3.75 12.3259V20.7666C3.75 22.0734 3.75 22.7268 4.00432 23.226C4.22802 23.665 4.58498 24.022 5.02402 24.2457C5.52315 24.5 6.17654 24.5 7.48333 24.5H9.81667C10.1434 24.5 10.3067 24.5 10.4315 24.4364C10.5413 24.3805 10.6305 24.2912 10.6864 24.1815C10.75 24.0567 10.75 23.8933 10.75 23.5666V15.8666C10.75 15.2133 10.75 14.8866 10.8772 14.637C10.989 14.4175 11.1675 14.239 11.387 14.1271C11.6366 14 11.9633 14 12.6167 14H15.8833C16.5367 14 16.8634 14 17.113 14.1271C17.3325 14.239 17.511 14.4175 17.6228 14.637C17.75 14.8866 17.75 15.2133 17.75 15.8666V23.5666C17.75 23.8933 17.75 24.0567 17.8136 24.1815C17.8695 24.2912 17.9587 24.3805 18.0685 24.4364C18.1933 24.5 18.3566 24.5 18.6833 24.5H21.0167C22.3235 24.5 22.9769 24.5 23.476 24.2457C23.915 24.022 24.272 23.665 24.4957 23.226C24.75 22.7268 24.75 22.0734 24.75 20.7666V12.3259C24.75 11.6558 24.75 11.3208 24.6636 11.0122C24.5871 10.7389 24.4614 10.4819 24.2926 10.2537C24.1021 9.99606 23.8376 9.79037 23.3087 9.37898L15.396 3.22467Z"
                fill="#B270EA"
                stroke="#B270EA"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span className="caption1 mt-1">매장</span>
          </div>

          {/* 더보기 */}
          <div className="flex flex-col items-center text-[var(--color-grey-650)]">
            {/* 더보기 아이콘 */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="#8E8E8E"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>{" "}
            <span className="caption1 mt-1">더보기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

type ReservationProps = {};

const Reservation = (props: ReservationProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-black text-white">
        <header className="flex items-center justify-between px-4 py-4">
          <span className="font-bold text-xl text-[#9A50E0]">BEAUTIFLOW</span>
        </header>

        <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">배너 이미지</span>
        </div>

        <section className="px-4 py-3">
          <h2 className="text-lg font-semibold">뷰티플로우</h2>
          <p className="text-sm text-gray-400 mt-1">
            네일샵 한 줄 소개입니다. 한 줄 소개는 254px * 42px을 넘어가지 않고,
            이후는 말 줄임표...
          </p>

          <div className="flex gap-2 mt-3">
            <div className="bg-[#40314C] rounded-md p-2 text-xs">
              공지사항을 읽고 예약해주세요. 공지사항을 읽고 예약해주세요. 공지사항을 읽고 예약해주세요.
            </div>
            <div className="bg-[#40314C] rounded-md p-2 text-xs">
              공지사항을 읽고 예약해주세요. 공지사항을 읽고 예약해주세요. 공지사항을 읽고 예약해주세요.
            </div>
          </div>
        </section>

        <div className="flex border-b border-gray-700 px-4 bg-black">
          <button className="py-2 px-4 border-b-2 font-semibold">
            예약
          </button>
          <button className="py-2 px-4 text-gray-400">정보</button>
        </div>

        <div className="flex gap-2 px-4 py-3">
        <button className="rounded-full px-4 py-1 text-gray-300"
            style={{
              backgroundColor: "#40314C",
              border: "1.5px solid #B270EA"
            }}
          >
            손
          </button>
          <button className="bg-gray-700 text-gray-300 rounded-full px-4 py-1">발</button>
          <button className="bg-gray-700 text-gray-300 rounded-full px-4 py-1">기타</button>
        </div>

        <section className="flex-1 overflow-y-auto px-4 pb-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-white font-semibold mb-2">이달의 아트</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-400 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center text-xs text-gray-400 mb-1">
                    <span>소요시간 | 60분</span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    34,000원 ~ 47,000원
                  </div>
                  <div className="text-xs text-gray-400 mt-1 leading-snug">
                    9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어주세요!
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Reservation;
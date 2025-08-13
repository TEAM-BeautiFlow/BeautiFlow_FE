import { Outlet } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../types/reservations";

// 더미 데이터
const dummyReservations: Reservation[] = [
  {
    reservationId: 1,
    status: "PENDING",
    shopId: 1,
    shopName: "매장명",
    shopImageUrl: "",
    shopAddress:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    reservationDate: "2025.07.06",
    startTime: "오후 1시",
    totalPrice: 110000,
    totalDurationMinutes: 120,
    customerName: "고객명",
    designerId: 2,
    designerName: "시술자명",
    requestNotes: "잘부탁드립니다",
    treatments: [
      {
        treatmentName: "이달의 아트",
        treatmentPrice: 60000,
        treatmentImageUrls: [
          "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/sample-treatment1.jpg",
          "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/sample-treatment2.jpg",
        ],
        treatmentDurationMinutes: 60,
      },
      {
        treatmentName: "패디큐어",
        treatmentPrice: 50000,
        treatmentImageUrls: [
          "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/sample-treatment1.jpg",
          "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/sample-treatment2.jpg",
        ],
        treatmentDurationMinutes: 60,
      },
    ],
    optionGroups: [
      {
        groupName: "젤 제거",
        optionItems: [
          {
            itemName: "자샵",
          },
        ],
      },
      {
        groupName: "연장",
        optionItems: [
          {
            itemName: "6-10개",
          },
        ],
      },
    ],
    styleImageUrls: [
      "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/sample-treatment1.jpg",
      "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/sample-treatment2.jpg",
    ],
  },
];

export default function ReservationWrapper() {
  return (
    <ReservationContext.Provider value={{ reservations: dummyReservations }}>
      <Outlet />
    </ReservationContext.Provider>
  );
}

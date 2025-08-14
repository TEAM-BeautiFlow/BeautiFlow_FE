export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "NO_SHOW"
  | "COMPLETED";

export interface Treatment {
  treatmentName: string;
  treatmentPrice: number;
  treatmentImageUrls: string[];
  treatmentDurationMinutes: number;
}

export interface Option {
  groupName: string;
  optionItems: OptionItem[];
}

export interface OptionItem {
  itemName: string;
}
//손님-예약용
export interface Reservation {
  status: ReservationStatus;
  reservationId: number;
  shopId: number;
  shopImageUrl: string;
  shopName: string;
  shopAddress: string;
  reservationDate: string;
  startTime: string;
  totalPrice: number;
  totalDurationMinutes: number;
  customerName: string;
  designerId: number;
  designerName: string;
  treatments: Treatment[];
  optionGroups: Option[];
  requestNotes: string;
  styleImageUrls: string[];
}

//사장님-고객용
export interface Reservations {
  reservationId: number;
  imageUrl: string;
  shopName: string;
  designerName: string;
  treatmentName: string;
  optionNames: string[];
  date: string;
  time: string;
  status: ReservationStatus;
}

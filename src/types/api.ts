// src/types/api.ts

// API 응답의 공통 구조
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
}

export interface BusinessHour {
  dayOfWeek: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  openTime: string;
  closeTime: string;
  breakStart: string;
  breakEnd: string;
  isClosed: boolean;
}

export interface TreatmentImage {
  id: number;
  imageUrl: string;
}

export interface Treatment {
  id: number;
  category: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  images: TreatmentImage[];
}

export interface ShopData {
  id: number;
  shopName: string;
  contact: string;
  address: string;
  introText: string;
  mainImageUrl: string;
  notices: Notice[];
  businessHours: BusinessHour[];
  treatments: Treatment[];
}

export interface SShopData {
  id: number;
  name: string;
  contact: string;
  address: string;
  introText: string;
  mainImageUrl: string;
  notices: Notice[];
  businessHours: BusinessHour[];
  treatments: Treatment[];
}

// 매장 정보 수정 요청 DTO
export interface ShopUpdateRequestDto {
  shopName?: string;
  contact?: string;
  link?: string;
  accountInfo?: string;
  address?: string;
  introduction?: string;
  deleteImageIds?: number[];
  newImages?: string[];
}

// 옵션 그룹 아이템
export interface OptionItem {
  id: number;
  name: string;
  extraMinutes: number;
  price: number;
  description: string;
}

// 옵션 그룹
export interface OptionGroup {
  id: number;
  name: string;
  enabled: boolean;
  items: OptionItem[];
}

// 옵션 페이지의 API 응답 데이터 구조
export interface TreatmentDetailWithOption {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
  images: TreatmentImage[];
  optionGroups: OptionGroup[];
}

// --- BookingPage에서 사용할 타입들 ---

// 예약 가능 날짜
export interface AvailableDatesResponse {
  availableDates: { [key: string]: boolean };
}

// 예약 가능 시간
export interface AvailableTimesResponse {
  timeSlots: Record<string, boolean>; // "HH:MM": true/false
}

// 디자이너 정보
export interface Designer {
  id: number;
  name: string;
  profileImageUrl: string;
  isOwner: boolean;
  intro: string;
}

// 예약 가능 디자이너 목록
export interface AvailableDesignersResponse {
  designers: Designer[];
}

export interface ReservationPortfolio {
  treatmentName: string;
  price: number;
  referenceImages: string;
  // additionalProp2: any; // 필요하다면 다른 속성들도 추가
  // additionalProp3: any;
}

export interface MyReservationInfo {
  customerUsername: string;
  reservationDate: string;
  startTime: string;
  durationMinutes: number;
  shopName: string;
  designerName: string;
  
  // ⚠️ 수정: portfolio와 options를 payInfo로 변경
  // payInfo는 { "시술/옵션 이름": 가격 } 형태의 객체입니다.
  payInfo: Record<string, number>; 
  
  shopAccountInfo: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
  };
  deposit: number;
}
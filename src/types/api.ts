// src/types/api.ts

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

// ⚠️ 추가된 인터페이스: 옵션 그룹 아이템
export interface OptionItem {
  id: number;
  name: string;
  extraMinutes: number;
  price: number; // ⚠️ API 응답에 맞춰 price 필드 추가
  description: string;
}

// ⚠️ 추가된 인터페이스: 옵션 그룹
export interface OptionGroup {
  id: number;
  name: string;
  enabled: boolean;
  items: OptionItem[];
}

// ⚠️ 추가된 인터페이스: 옵션 페이지의 API 응답 데이터 구조
export interface TreatmentDetailWithOption {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
  images: TreatmentImage[];
  optionGroups: OptionGroup[];
}

// API 응답의 공통 구조
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}
import api from "../axiosInstance";

export interface TodayReservationCountsDto {
  pending: number;
  completed: number;
  cancelled: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export const getTodayReservationCounts =
  async (): Promise<TodayReservationCountsDto> => {
    const res = await api.get<ApiEnvelope<TodayReservationCountsDto>>(
      "/reservations/months",
    );
    return res.data.data;
  };

export interface MonthlyReservationItemDto {
  reservationId: number;
  customerId: number;
  customerName: string;
  startTime: string;
  endTime: string;
  status: string;
  treatmentName: string | null;
  treatmentCategory: string | null;
  date?: string;
}

export interface CommonPageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
}

export const getMonthlyReservations = async (
  month: string,
  page = 0,
  size = 20,
  sort: string,
): Promise<CommonPageResponse<MonthlyReservationItemDto>> => {
  const res = await api.get<
    ApiEnvelope<CommonPageResponse<MonthlyReservationItemDto>>
  >("/reservations/timeslots/paged", { params: { month, page, size, sort } });
  return res.data.data;
};

export interface ReservationDetailDto {
  reservationId: number;
  designerId: number;
  customerName: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm[:ss]
  endTime: string; // HH:mm[:ss]
  status: string;
  treatmentNames: string[];
  optionNames: string[];
  paymentInfo: {
    method: string;
    status: string;
    depositAmount: number;
    shopPayAmount: number;
  };
  imageUrls: string[];
  durationText: string;
  requestNotes: string;
}

export const getReservationDetail = async (
  reservationId: number,
): Promise<ReservationDetailDto> => {
  const res = await api.get<ApiEnvelope<ReservationDetailDto>>(
    `/reservations/${reservationId}`,
  );
  return res.data.data;
};

export interface UpdateReservationStatusRes {
  reservationId: number;
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string; // 서버 상태 키
}

export const updateReservationStatus = async (
  reservationId: number,
  status: string,
): Promise<UpdateReservationStatusRes> => {
  const res = await api.patch<ApiEnvelope<UpdateReservationStatusRes>>(
    `/reservations/${reservationId}/status`,
    { status },
  );
  return res.data.data;
};

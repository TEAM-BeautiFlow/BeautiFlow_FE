import { create } from "zustand";

interface SelectedOption {
  optionGroupId: number;
  optionItemId: number;
}

// 스토어에 저장될 데이터의 타입
interface BookingState {
  // --- (추가) 시술 기본 정보 ---
  treatmentName: string | null;
  treatmentPrice: number | null;
  treatmentImageUrl: string | null;
  // -------------------------

  treatmentId: number | null;
  selectedOptions: SelectedOption[];
  date: string | null;
  time: string | null;
  designerId: number | null;
  requestNotes: string;
  styleImageFiles: File[];
  // --- (추가) 참고 이미지 URL들 ---
  referenceImageUrls: string[];
  // ------------------------------
}

// 스토어에서 사용할 액션(함수)들의 타입
interface BookingActions {
  // --- (추가) 시술 정보 저장 액션 ---
  setTreatmentInfo: (payload: {
    name: string;
    price: number;
    imageUrl: string;
  }) => void;
  // --------------------------------

  setTreatmentId: (id: number) => void;
  setSelectedOptions: (options: SelectedOption[]) => void;
  // --- (수정) 참고 이미지 URL들도 함께 저장 ---
  setDateTimeDesigner: (payload: {
    date: string;
    time: string;
    designerId: number;
    referenceImages?: string[]; // 선택적 필드로 추가
  }) => void;
  // ------------------------------------------
  setRequestInfo: (payload: { notes: string; files: File[] }) => void;
  // --- (추가) 참고 이미지 URL들만 별도로 설정하는 액션 ---
  setReferenceImages: (urls: string[]) => void;
  // --------------------------------------------
  resetBookingState: () => void;
}

// 스토어의 초기 상태
const initialState: BookingState = {
  // --- (추가) ---
  treatmentName: null,
  treatmentPrice: null,
  treatmentImageUrl: null,
  // -------------

  treatmentId: null,
  selectedOptions: [],
  date: null,
  time: null,
  designerId: null,
  requestNotes: "",
  styleImageFiles: [],
  // --- (추가) ---
  referenceImageUrls: [],
  // -------------
};

// Zustand 스토어 생성
const useBookingStore = create<BookingState & BookingActions>(set => ({
  ...initialState,

  // --- Actions ---

  // (추가) 시술 이름, 가격, 이미지를 저장하는 액션
  setTreatmentInfo: payload =>
    set({
      treatmentName: payload.name,
      treatmentPrice: payload.price,
      treatmentImageUrl: payload.imageUrl,
    }),

  setTreatmentId: id => set({ treatmentId: id }),

  setSelectedOptions: options => set({ selectedOptions: options }),

  // --- (수정) 참고 이미지도 함께 저장 ---
  setDateTimeDesigner: payload =>
    set({
      date: payload.date,
      time: payload.time,
      designerId: payload.designerId,
      referenceImageUrls: payload.referenceImages || [],
    }),
  // ----------------------------------

  setRequestInfo: payload =>
    set({
      requestNotes: payload.notes,
      styleImageFiles: payload.files,
    }),

  // --- (추가) 참고 이미지 URL들만 별도로 설정 ---
  setReferenceImages: urls =>
    set({
      referenceImageUrls: urls,
    }),
  // -------------------------------------------

  // 모든 상태를 초기값으로 되돌리는 액션
  resetBookingState: () => set(initialState),
}));

export default useBookingStore;

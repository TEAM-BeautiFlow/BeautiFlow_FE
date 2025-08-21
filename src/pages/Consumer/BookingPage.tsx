import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import api from "@/apis/axiosInstance";
import "../../styles/color-system.css";
import "../../styles/type-system.css";

import useBookingStore from "../../stores/bookingStore";
import type {
  ApiResponse,
  AvailableDatesResponse,
  AvailableTimesResponse,
  Designer,
} from "../../types/api";

const BookingPage = () => {
  const { shopId, treatmentId } = useParams<{
    shopId: string;
    treatmentId: string;
  }>();
  const navigate = useNavigate();
  const setDateTimeDesigner = useBookingStore(
    state => state.setDateTimeDesigner,
  );
  
  // ▼▼▼ 1. isProceeding ref 추가 ▼▼▼
  const isProceeding = useRef(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Record<string, boolean>>(
    {},
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    Record<string, boolean>
  >({});

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDesigners, setAvailableDesigners] = useState<Designer[]>([]);
  const [selectedDesignerId, setSelectedDesignerId] = useState<number | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isTimeSlotsLoading, setIsTimeSlotsLoading] = useState(false);
  const [isDesignersLoading, setIsDesignersLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!shopId) return;
      try {
        setIsLoading(true);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const response = await api.get<ApiResponse<AvailableDatesResponse>>(
          `/reservations/shops/${shopId}/available-dates`,
          {
            params: { year, month },
          },
        );

        if (response.data.success && response.data.data) {
          setAvailableDates(response.data.data.availableDates);
        } else {
          setAvailableDates({});
        }
      } catch (err) {
        console.error("Error fetching available dates:", err);
        setAvailableDates({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableDates();
  }, [shopId, currentDate]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!shopId || !selectedDate || !treatmentId) {
        setAvailableTimeSlots({});
        return;
      }
      try {
        setIsTimeSlotsLoading(true);
        const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        const response = await api.get<ApiResponse<AvailableTimesResponse>>(
          `/reservations/shops/${shopId}/available-times`,
          {
            params: { date: dateString, treatmentId: treatmentId },
          },
        );

        if (response.data.success && response.data.data) {
          setAvailableTimeSlots(response.data.data.timeSlots);
        } else {
          setAvailableTimeSlots({});
        }
      } catch (err) {
        console.error("Error fetching available times:", err);
        setAvailableTimeSlots({});
      } finally {
        setIsTimeSlotsLoading(false);
      }
    };
    fetchAvailableTimes();
  }, [selectedDate, shopId, treatmentId]);

  useEffect(() => {
    const fetchAvailableDesigners = async () => {
      if (!shopId || !selectedDate || !selectedTime) {
        setAvailableDesigners([]);
        return;
      }
      try {
        setIsDesignersLoading(true);
        const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        const response = await api.get(
          `/reservations/shops/${shopId}/available-designers`,
          {
            params: { date: dateString, time: selectedTime },
          },
        );

        if (response.data && Array.isArray(response.data)) {
          setAvailableDesigners(response.data);
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setAvailableDesigners(response.data.data);
        } else {
          console.warn("Unexpected designer response format:", response.data);
          setAvailableDesigners([]);
        }
      } catch (err) {
        console.error("Error fetching available designers:", err);
        setAvailableDesigners([]);
      } finally {
        setIsDesignersLoading(false);
      }
    };
    fetchAvailableDesigners();
  }, [selectedDate, selectedTime, shopId]);
  
  // ▼▼▼ 2. 페이지 이탈 시 임시 예약 삭제를 위한 useEffect 추가 ▼▼▼
  useEffect(() => {
    const deleteTempReservation = () => {
      if (!shopId || isProceeding.current) {
        return;
      }

      console.log("Deleting temporary reservation...");

      const formData = new FormData();
      const requestData = { deleteTempReservation: true };
      formData.append("request", JSON.stringify(requestData));

      api.post(`/reservations/${shopId}/process`, formData)
        .catch(err => console.error("Failed to delete temp reservation:", err));
    };

    window.addEventListener("beforeunload", deleteTempReservation);

    return () => {
      window.removeEventListener("beforeunload", deleteTempReservation);
      deleteTempReservation();
    };
  }, [shopId]);

  const resetSelection = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableDesigners([]);
    setSelectedDesignerId(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
    resetSelection();
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
    resetSelection();
  };

  const handleDateSelect = (date: Date) => {
    if (selectedDate?.getTime() === date.getTime()) {
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableDesigners([]);
      setSelectedDesignerId(null);
    } else {
      setSelectedDate(date);
      setSelectedTime(null);
      setAvailableDesigners([]);
      setSelectedDesignerId(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedDesignerId(null);
  };

  // ▼▼▼ 3. handleNextStep 함수 수정 ▼▼▼
  const handleNextStep = async () => {
    if (!selectedDate || !selectedTime || !selectedDesignerId) {
      alert("날짜, 시간, 디자이너를 모두 선택해주세요.");
      return;
    }
    
    isProceeding.current = true; // 정상 진행으로 플래그 설정

    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    setDateTimeDesigner({
      date: dateString,
      time: selectedTime,
      designerId: selectedDesignerId,
      referenceImages: [],
    });

    try {
      setIsProcessing(true);

      const formData = new FormData();
      
      const requestData = {
        dateTimeDesignerData: {
          date: dateString,
          time: selectedTime,
          designerId: selectedDesignerId,
        }
      };
      
      formData.append('request', JSON.stringify(requestData));

      const processResponse = await api.post(
        `/reservations/${shopId}/process`,
        formData
      );

      if (processResponse.data.success) {
        navigate(`/user/store/appointment-booking/${shopId}/${treatmentId}`);
      } else {
        alert("예약 처리 중 오류가 발생했습니다.");
        isProceeding.current = false; // 실패 시 플래그 리셋
      }
    } catch (error) {
      console.error("예약 처리 중 오류:", error);
      alert("예약 처리 중 오류가 발생했습니다.");
      isProceeding.current = false; // 에러 시 플래그 리셋
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCalendar = () => {
    // ... (이하 코드는 변경 사항 없음)
    const days = [];
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const totalDaysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const selectedDateString = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : null;

    daysOfWeek.forEach(day => {
      days.push(
        <div
          key={day}
          className="caption2 text-center"
          style={{
            color: "var(--color-grey-450)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          {day}
        </div>,
      );
    });

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      const isSelected = selectedDateString === dateString;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < startOfToday;
      const isAvailable = availableDates[dateString] && !isPast;
      let isDisabled = !isAvailable;

      let bgColor = "transparent";
      let textColor = "var(--color-white)";
      let fontWeight = "var(--font-weight-medium)";
      let borderColor = "transparent";

      if (isSelected) {
        bgColor = "var(--color-dark-purple)";
        textColor = "var(--color-white)";
        fontWeight = "var(--font-weight-semibold)";
        borderColor = "var(--color-purple)";
      } else if (isToday) {
        bgColor = "var(--color-grey-850)";
        textColor = "var(--color-white)";
        fontWeight = "var(--font-weight-semibold)";
        borderColor = "var(--color-grey-850)";
      } else if (isDisabled) {
        textColor = "var(--color-grey-650)";
      }

      days.push(
        <div
          key={i}
          className={`label1 rounded-full py-2.5 text-center text-sm transition-all ${!isDisabled ? "cursor-pointer" : "cursor-default"}`}
          style={{
            color: textColor,
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: isSelected || isToday ? "1.5px" : "0",
            borderStyle: "solid",
            fontWeight: fontWeight,
          }}
          onClick={() => !isDisabled && handleDateSelect(date)}
        >
          {i}
        </div>,
      );
    }
    return days;
  };

  const TimeSlot = ({
    time,
    isSelected,
    onClick,
    isDisabled = false,
  }: {
    time: string;
    isSelected: boolean;
    onClick: () => void;
    isDisabled?: boolean;
  }) => {
    let bgColor = "var(--color-grey-950)";
    let textColor = "var(--color-white)";
    let borderColor = "var(--color-grey-850)";

    if (isSelected) {
      bgColor = "var(--color-dark-purple)";
      textColor = "var(--color-white)";
      borderColor = "var(--color-purple)";
    } else if (isDisabled) {
      bgColor = "var(--color-grey-850)";
      textColor = "var(--color-grey-650)";
      borderColor = "var(--color-black)";
    }

    return (
      <button
        className={`label1 rounded-lg px-4 py-2 text-sm transition-all`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: borderColor,
          borderWidth: "1.5px",
          borderStyle: "solid",
          fontWeight: "var(--font-weight-medium)",
        }}
        onClick={onClick}
        disabled={isDisabled}
      >
        {time}
      </button>
    );
  };

  const DesignerCard = ({
    designer,
    isSelected,
    onClick,
  }: {
    designer: Designer;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-all`}
      style={{
        borderColor: isSelected
          ? "var(--color-purple)"
          : "var(--color-grey-850)",
        backgroundColor: isSelected
          ? "var(--color-dark-purple)"
          : "var(--color-black)",
      }}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div
          className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-cover bg-center"
          style={{
            backgroundImage: designer.profileImageUrl
              ? `url(${designer.profileImageUrl})`
              : "none",
            backgroundColor: "var(--color-grey-350)",
          }}
        >
          {!designer.profileImageUrl && (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-grey-650)" }}
            >
              <span className="text-xl" style={{ color: "var(--color-white)" }}>
                {designer.name ? designer.name.charAt(0) : "?"}
              </span>
            </div>
          )}

          {isSelected && (
            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-purple-500">
              <Check
                className="h-10 w-10"
                style={{ color: "var(--color-white)" }}
              />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <h4
            className="label1 mb-1 flex items-center"
            style={{
              color: "var(--color-white)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            {designer.isOwner && (
              <span
                className="caption2 mr-2 rounded-full px-2 py-0.5"
                style={{
                  backgroundColor: "var(--color-grey-750)",
                  color: "var(--color-white)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                원장님
              </span>
            )}
            {designer.name || "이름 없음"}
          </h4>
          <p
            className="caption2"
            style={{
              color: "var(--color-grey-450)",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
          >
            {designer.intro || "소개가 없습니다."}
          </p>
        </div>
      </div>
    </div>
  );

  const getMorningTimes = () => {
    return Object.keys(availableTimeSlots)
      .filter(time => parseInt(time.split(":")[0]) < 12)
      .sort();
  };
  const getAfternoonTimes = () => {
    return Object.keys(availableTimeSlots)
      .filter(time => parseInt(time.split(":")[0]) >= 12)
      .sort();
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{ backgroundColor: "var(--color-black)" }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-black px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-0 bg-transparent border-none cursor-pointer">
            <ChevronLeft className="h-6 w-6" style={{ color: "var(--color-white)" }} />
        </button>
        <h1 className="title1" style={{ color: "var(--color-white)" }}>
          시술 예약하기
        </h1>
        <button onClick={() => navigate("/")} className="p-0 bg-transparent border-none cursor-pointer">
            <X className="h-6 w-6" style={{ color: "var(--color-white)" }} />
        </button>
      </div>

      <div className="px-5 py-4 pb-32">
        <div className="mb-8">
          <h2
            className="label1"
            style={{ color: "var(--color-white)", marginBottom: "16px" }}
          >
            시술 일시
          </h2>

          <div className="mb-6 flex items-center justify-center">
            <button onClick={handlePrevMonth} className="p-0 bg-transparent border-none cursor-pointer">
                <ChevronLeft
                className="h-5 w-5"
                style={{ color: "var(--color-grey-450)" }}
                />
            </button>
            <span
              className="title1 mx-4"
              style={{ color: "var(--color-white)" }}
            >
              {`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
            </span>
            <button onClick={handleNextMonth} className="p-0 bg-transparent border-none cursor-pointer">
                <ChevronRight
                className="h-5 w-5"
                style={{ color: "var(--color-grey-450)" }}
                />
            </button>
          </div>

          {isLoading ? (
            <p
              className="text-center"
              style={{ color: "var(--color-grey-450)" }}
            >
              달력을 불러오는 중...
            </p>
          ) : (
            <div className="mb-6 grid grid-cols-7 gap-1">
              {generateCalendar()}
            </div>
          )}
        </div>

        {selectedDate && (
          <div className="mb-8">
            <h3
              className="label1"
              style={{ color: "var(--color-white)", marginBottom: "16px" }}
            >
              오전
            </h3>
            {isTimeSlotsLoading ? (
              <p
                className="text-center"
                style={{ color: "var(--color-grey-450)" }}
              >
                시간대를 불러오는 중...
              </p>
            ) : (
              <div className="mb-6 grid grid-cols-4 gap-2">
                {getMorningTimes().map(time => (
                  <TimeSlot
                    key={time}
                    time={time}
                    isSelected={selectedTime === time}
                    onClick={() => handleTimeSelect(time)}
                    isDisabled={!availableTimeSlots[time]}
                  />
                ))}
              </div>
            )}

            <h3
              className="label1"
              style={{ color: "var(--color-white)", marginBottom: "16px" }}
            >
              오후
            </h3>
            {isTimeSlotsLoading ? (
              <p
                className="text-center"
                style={{ color: "var(--color-grey-450)" }}
              >
                시간대를 불러오는 중...
              </p>
            ) : (
              <div className="mb-8 grid grid-cols-4 gap-2">
                {getAfternoonTimes().map(time => (
                  <TimeSlot
                    key={time}
                    time={time}
                    isSelected={selectedTime === time}
                    onClick={() => handleTimeSelect(time)}
                    isDisabled={!availableTimeSlots[time]}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTime && (
          <div className="mb-8">
            <h3
              className="label1"
              style={{ color: "var(--color-white)", marginBottom: "16px" }}
            >
              디자이너 선택
            </h3>
            {isDesignersLoading ? (
              <p
                className="text-center"
                style={{ color: "var(--color-grey-450)" }}
              >
                선택하신 시간에 예약 가능한 디자이너를 찾고 있습니다...
              </p>
            ) : (
              <div className="space-y-4">
                {availableDesigners.length > 0 ? (
                  availableDesigners.map(designer => (
                    <DesignerCard
                      key={designer.id}
                      designer={designer}
                      isSelected={selectedDesignerId === designer.id}
                      onClick={() => setSelectedDesignerId(designer.id)}
                    />
                  ))
                ) : (
                  <p
                    className="text-center"
                    style={{ color: "var(--color-grey-450)" }}
                  >
                    예약 가능한 디자이너가 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-sm px-5 py-4"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        <button
          className="label1 flex w-full items-center justify-center rounded-lg py-4 transition-opacity"
          style={{
            background:
              "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)",
            color: "var(--color-white)",
            fontWeight: "var(--font-weight-semibold)",
            opacity:
              !selectedDate || !selectedTime || !selectedDesignerId || isProcessing ? 0.5 : 1,
            cursor:
              !selectedDate || !selectedTime || !selectedDesignerId || isProcessing
                ? "not-allowed"
                : "pointer",
          }}
          disabled={!selectedDate || !selectedTime || !selectedDesignerId || isProcessing}
          onClick={handleNextStep}
        >
          {isProcessing ? "처리 중..." : "다음으로"}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
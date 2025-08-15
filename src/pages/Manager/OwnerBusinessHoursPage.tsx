import { useState, useEffect } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "@/layout/ManagerNavbar"; // 🔽 ManagerNavbar를 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// --- 데이터 형식 변환을 위한 맵 ---
const cycleApiMap = {
  매주: "WEEKLY",
  격주: "BIWEEKLY",
  "매달 첫째 주": "FIRST_WEEK",
  "매달 둘째 주": "SECOND_WEEK",
  "매달 셋째 주": "THIRD_WEEK",
  "매달 넷째 주": "FOURTH_WEEK",
  "매달 다섯째 주": "FIFTH_WEEK",
} as const;
type CycleKorean = keyof typeof cycleApiMap;
type CycleApi = (typeof cycleApiMap)[CycleKorean];
const cycleUiMap: Record<CycleApi, CycleKorean> = (
  Object.entries(cycleApiMap) as Array<[CycleKorean, CycleApi]>
).reduce(
  (acc, [k, v]) => {
    acc[v] = k;
    return acc;
  },
  {} as Record<CycleApi, CycleKorean>,
);

const dayApiMap = {
  월요일: "MON",
  화요일: "TUE",
  수요일: "WED",
  목요일: "THU",
  금요일: "FRI",
  토요일: "SAT",
  일요일: "SUN",
} as const;
type DayKorean = keyof typeof dayApiMap;
type DayApi = (typeof dayApiMap)[DayKorean];
const dayUiMap: Record<DayApi, DayKorean> = (
  Object.entries(dayApiMap) as Array<[DayKorean, DayApi]>
).reduce(
  (acc, [k, v]) => {
    acc[v] = k;
    return acc;
  },
  {} as Record<DayApi, DayKorean>,
);

const dayOptions: ReadonlyArray<DayKorean> = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

// --- 요일 선택 모달 컴포넌트 ---
interface DaySelectionModalProps {
  show: boolean;
  onClose: () => void;
  selectedDays: DayKorean[];
  setSelectedDays: Dispatch<SetStateAction<DayKorean[]>>;
}

const DaySelectionModal = ({
  show,
  onClose,
  selectedDays,
  setSelectedDays,
}: DaySelectionModalProps) => {
  if (!show) {
    return null;
  }

  const handleDayClick = (day: DayKorean) => {
    setSelectedDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...dayOptions].filter(d => [...prevDays, day].includes(d)),
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--color-grey-850)",
          padding: "24px",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "350px",
          border: "1px solid var(--color-grey-750)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          className="title2"
          style={{
            color: "var(--color-white)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          요일 선택
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          {dayOptions.map(day => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className="body2"
              style={{
                flex: "1 1 30%",
                padding: "12px 0",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: selectedDays.includes(day)
                  ? "var(--color-light-purple)"
                  : "var(--color-grey-750)",
                backgroundColor: selectedDays.includes(day)
                  ? "rgba(180, 154, 255, 0.1)"
                  : "transparent",
                color: selectedDays.includes(day)
                  ? "var(--color-light-purple)"
                  : "var(--color-white)",
                cursor: "pointer",
                fontWeight: selectedDays.includes(day)
                  ? "var(--font-weight-semibold)"
                  : "var(--font-weight-regular)",
              }}
            >
              {day}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="title3"
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: "8px",
            backgroundColor: "var(--color-light-purple)",
            color: "var(--color-white)",
            border: "none",
            cursor: "pointer",
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

const OwnerBusinessHoursPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");

  const [regularHolidayCycle, setRegularHolidayCycle] = useState<
    CycleKorean | ""
  >("");
  const [selectedDays, setSelectedDays] = useState<DayKorean[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!shopId) return;
      try {
        const [hoursResponse, holidaysResponse] = await Promise.allSettled([
          api.get(`/shops/manage/${shopId}/business-hours`),
          api.get(`/shops/manage/${shopId}/holidays`),
        ]);

        if (
          hoursResponse.status === "fulfilled" &&
          hoursResponse.value.data?.data
        ) {
          const { openTime, closeTime, breakStart, breakEnd } =
            hoursResponse.value.data.data;
          setOpenTime(openTime?.slice(0, 5) || "");
          setCloseTime(closeTime?.slice(0, 5) || "");
          setBreakStart(breakStart?.slice(0, 5) || "");
          setBreakEnd(breakEnd?.slice(0, 5) || "");
        } else if (hoursResponse.status === "rejected") {
          console.error("영업 시간 로딩 중 에러 발생:", hoursResponse.reason);
        }

        if (
          holidaysResponse.status === "fulfilled" &&
          holidaysResponse.value.data?.data
        ) {
          const holidayData = holidaysResponse.value.data.data;
          if (Array.isArray(holidayData) && holidayData.length > 0) {
            const { cycle, daysOfWeek } = holidayData[0];
            const apiCycle = cycle as string;
            const uiCycle = (cycleUiMap as Record<string, CycleKorean>)[
              apiCycle
            ];
            setRegularHolidayCycle(uiCycle || "");

            const apiDays = (daysOfWeek as string[]) || [];
            const uiDays = apiDays
              .map(d => (dayUiMap as Record<string, DayKorean>)[d])
              .filter(Boolean) as DayKorean[];
            setSelectedDays(uiDays);
          } else {
            setRegularHolidayCycle("");
            setSelectedDays([]);
          }
        } else if (holidaysResponse.status === "rejected") {
          console.error("휴일 정보 로딩 중 에러 발생:", holidaysResponse.reason);
        }
      } catch (error) {
        console.error("정보 로딩 중 예기치 않은 에러 발생:", error);
      }
    };
    fetchShopInfo();
  }, [shopId]);

  const handleSave = async () => {
    if (!shopId) return;

    const promises = [];

    promises.push(
      api.put(
        `/shops/manage/${shopId}/business-hours`,
        {
          openTime: openTime || null,
          closeTime: closeTime || null,
          breakStart: breakStart || null,
          breakEnd: breakEnd || null,
        }
      ),
    );

    if (regularHolidayCycle && selectedDays.length > 0) {
      promises.push(
        api.put(
          `/shops/manage/${shopId}/holidays`,
          [
            {
              cycle: cycleApiMap[regularHolidayCycle as CycleKorean],
              daysOfWeek: selectedDays.map(day => dayApiMap[day]),
            },
          ] as Array<{ cycle: CycleApi; daysOfWeek: DayApi[] }>,
        ),
      );
    } else if (!regularHolidayCycle && selectedDays.length === 0) {
      promises.push(
        api.put(
          `/shops/manage/${shopId}/holidays`,
          [] as Array<{ cycle: CycleApi; daysOfWeek: DayApi[] }>,
        ),
      );
    } else {
      showCustomAlert(
        "정기 휴무일을 저장하려면 주기와 요일을 모두 선택하거나 모두 비워두세요.",
      );
      return;
    }

    try {
      await Promise.all(promises);
      showCustomAlert("영업 정보가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (error: any) {
      console.error("저장 실패:", error);
      showCustomAlert(
        "저장에 실패했습니다. 다시 시도해주세요. (오류: " +
          (error.response?.data?.message || error.message) +
          ")",
      );
    }
  };

  const generateTimeOptions = (): string[] => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  const holidayCycleOptions: ReadonlyArray<CycleKorean> = [
    "매주",
    "격주",
    "매달 첫째 주",
    "매달 둘째 주",
    "매달 셋째 주",
    "매달 넷째 주",
    "매달 다섯째 주",
  ];

  interface TimeDropdownProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    placeholder: string;
  }

  const TimeDropdown = ({
    value,
    onChange,
    placeholder,
  }: TimeDropdownProps) => (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value}
        onChange={onChange}
        className="body2"
        style={{
          width: "100%",
          backgroundColor: "var(--color-grey-850)",
          border: "1px solid var(--color-grey-750)",
          borderRadius: "8px",
          padding: "16px",
          color: value ? "var(--color-white)" : "var(--color-grey-450)",
          fontFamily: "Pretendard, sans-serif",
          outline: "none",
          appearance: "none",
          paddingRight: "40px",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {generateTimeOptions().map(time => (
          <option
            key={time}
            value={time}
            style={{
              backgroundColor: "var(--color-grey-850)",
              color: "var(--color-white)",
            }}
          >
            {time}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        style={{
          color: "var(--color-grey-450)",
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  interface CustomDropdownProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: ReadonlyArray<string>;
    placeholder: string;
  }

  const CustomDropdown = ({
    value,
    onChange,
    options,
    placeholder,
  }: CustomDropdownProps) => (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value}
        onChange={onChange}
        className="body2"
        style={{
          width: "100%",
          backgroundColor: "var(--color-grey-850)",
          border: "1px solid var(--color-grey-750)",
          borderRadius: "8px",
          padding: "16px",
          color: value ? "var(--color-white)" : "var(--color-grey-450)",
          fontFamily: "Pretendard, sans-serif",
          outline: "none",
          appearance: "none",
          paddingRight: "40px",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(option => (
          <option
            key={option}
            value={option}
            style={{
              backgroundColor: "var(--color-grey-850)",
              color: "var(--color-white)",
            }}
          >
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        style={{
          color: "var(--color-grey-450)",
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px 24px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1
          className="title1"
          style={{ color: "var(--color-white)", margin: 0 }}
        >
          영업 시간
        </h1>
        <button
          className="label1"
          style={{
            color: "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      {/* Content Area */}
      {/* 🔽 pb-28 추가하여 네비게이션 바 공간 확보 */}
      <div style={{ padding: "0 20px 110px" }}>
        {/* 영업 시간 섹션 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            영업 시간{" "}
            <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <TimeDropdown
              value={openTime}
              onChange={e => setOpenTime(e.target.value)}
              placeholder="시작"
            />
            <TimeDropdown
              value={closeTime}
              onChange={e => setCloseTime(e.target.value)}
              placeholder="끝"
            />
          </div>
        </div>
        {/* 브레이크 타임 섹션 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            브레이크 타임
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <TimeDropdown
              value={breakStart}
              onChange={e => setBreakStart(e.target.value)}
              placeholder="시작"
            />
            <TimeDropdown
              value={breakEnd}
              onChange={e => setBreakEnd(e.target.value)}
              placeholder="끝"
            />
          </div>
        </div>
        {/* 정기 휴무일 섹션 */}
        <div style={{ marginBottom: "32px" }}>
          <label
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            정기 휴무일
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "100%" }}>
              <CustomDropdown
                value={regularHolidayCycle}
                onChange={e =>
                  setRegularHolidayCycle(e.target.value as CycleKorean)
                }
                options={holidayCycleOptions}
                placeholder="주기"
              />
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="body2"
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                cursor: "pointer",
                color:
                  selectedDays.length > 0
                    ? "var(--color-white)"
                    : "var(--color-grey-450)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedDays.length > 0 ? selectedDays.join(", ") : "요일 지정"}
              <ChevronDown
                size={20}
                style={{
                  color: "var(--color-grey-450)",
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <DaySelectionModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />

      {showAlert && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAlert(false)}
        >
          <div
            style={{
              backgroundColor: "var(--color-grey-850)",
              padding: "24px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "300px",
              border: "1px solid var(--color-grey-750)",
              textAlign: "center",
            }}
            onClick={e => e.stopPropagation()}
          >
            <p
              className="body1"
              style={{ color: "var(--color-white)", marginBottom: "24px" }}
            >
              {alertMessage}
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="title3"
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: "8px",
                backgroundColor: "var(--color-light-purple)",
                color: "var(--color-white)",
                border: "none",
                cursor: "pointer",
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <ManagerNavbar />
    </div>
  );
};

export default OwnerBusinessHoursPage;

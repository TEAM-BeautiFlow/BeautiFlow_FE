import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';

import useBookingStore from '../../stores/bookingStore';
import type { ApiResponse, AvailableDatesResponse, AvailableTimesResponse, Designer } from '../../types/api';

const BookingPage = () => {
  const { shopId, treatmentId } = useParams<{ shopId: string, treatmentId: string }>();
  const navigate = useNavigate();
  const setDateTimeDesigner = useBookingStore((state) => state.setDateTimeDesigner);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Record<string, boolean>>({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Record<string, boolean>>({});
  
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDesigners, setAvailableDesigners] = useState<Designer[]>([]);
  const [selectedDesignerId, setSelectedDesignerId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isTimeSlotsLoading, setIsTimeSlotsLoading] = useState(false);
  const [isDesignersLoading, setIsDesignersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzNDg4NDIwMjEiLCJ1c2VySWQiOjU4LCJpYXQiOjE3NTQ5Njk5MDAsImV4cCI6MTc1NzU2MTkwMH0.BzWPMm9rWf7IlmRSeO7xFySG6lic0NuQha2dDWt8yzY";

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!shopId) return;
      try {
        setIsLoading(true);
        setError(null);
        
        const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const response = await axios.get<ApiResponse<AvailableDatesResponse>>(`${API_BASE_URL}/reservations/shops/${shopId}/available-dates`, {
          params: { year, month },
          headers,
        });

        if (response.data.success && response.data.data) {
          setAvailableDates(response.data.data.availableDates);
        } else {
          setAvailableDates({});
        }
      } catch (err) {
        console.error('Error fetching available dates:', err);
        setError("예약 가능 날짜를 불러오지 못했습니다.");
        setAvailableDates({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableDates();
  }, [shopId, currentDate]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!shopId || !treatmentId || !selectedDate) {
        setAvailableTimeSlots({});
        return;
      }
      try {
        setIsTimeSlotsLoading(true);
        const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
        const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        
        const response = await axios.get<ApiResponse<AvailableTimesResponse>>(`${API_BASE_URL}/reservations/shops/${shopId}/available-times`, {
          params: { date: dateString, treatmentId: Number(treatmentId) },
          headers,
        });

        if (response.data.success && response.data.data) {
          setAvailableTimeSlots(response.data.data.timeSlots);
        } else {
          setAvailableTimeSlots({});
        }
      } catch (err) {
        console.error('Error fetching available times:', err);
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
        const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
        const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        
        const response = await axios.get(`${API_BASE_URL}/reservations/shops/${shopId}/available-designers`, {
          params: { date: dateString, time: selectedTime },
          headers,
        });

        if (response.data && Array.isArray(response.data)) {
          setAvailableDesigners(response.data);
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setAvailableDesigners(response.data.data);
        } else {
          console.warn('Unexpected designer response format:', response.data);
          setAvailableDesigners([]);
        }
      } catch (err) {
        console.error('Error fetching available designers:', err);
        setAvailableDesigners([]);
      } finally {
        setIsDesignersLoading(false);
      }
    };
    fetchAvailableDesigners();
  }, [selectedDate, selectedTime, shopId]);

  const resetSelection = () => {
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableDesigners([]);
      setSelectedDesignerId(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    resetSelection();
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  // 다음 단계로 넘어가는 함수 (이미지 업로드 로직 제거)
  const handleNextStep = () => {
    if (selectedDate && selectedTime && selectedDesignerId) {
      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      
      setDateTimeDesigner({
        date: dateString,
        time: selectedTime,
        designerId: selectedDesignerId,
        referenceImages: [], // 이미지를 선택하지 않으므로 빈 배열 전달
      });

      navigate(`/appointment-booking/${shopId}/${treatmentId}`);
    } else {
      alert("날짜, 시간, 디자이너를 모두 선택해주세요.");
    }
  };

  const generateCalendar = () => {
    const days = [];
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const totalDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const selectedDateString = selectedDate 
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      : null;

    daysOfWeek.forEach(day => {
      days.push(
        <div key={day} className="text-center caption2" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      const isSelected = selectedDateString === dateString;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < startOfToday;
      const isAvailable = availableDates[dateString] && !isPast;
      let isDisabled = !isAvailable;
      
      let bgColor = 'transparent';
      let textColor = 'var(--color-white)';
      let fontWeight = 'var(--font-weight-medium)';
      let borderColor = 'transparent';

      if (isSelected) {
        bgColor = 'var(--color-dark-purple)';
        textColor = 'var(--color-white)';
        fontWeight = 'var(--font-weight-semibold)';
        borderColor = 'var(--color-purple)';
      } else if (isToday) {
        bgColor = 'var(--color-grey-850)';
        textColor = 'var(--color-white)';
        fontWeight = 'var(--font-weight-semibold)';
        borderColor = 'var(--color-grey-850)';
      } else if (isDisabled) {
        textColor = 'var(--color-grey-650)';
      }
      
      days.push(
        <div
          key={i}
          className={`text-center py-2.5 text-sm rounded-full transition-all label1 ${!isDisabled ? 'cursor-pointer' : 'cursor-default'}`}
          style={{
            color: textColor,
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: (isSelected || isToday) ? '1.5px' : '0',
            borderStyle: 'solid',
            fontWeight: fontWeight
          }}
          onClick={() => !isDisabled && handleDateSelect(date)}
        >
          {i}
        </div>
      );
    }
    return days;
  };
  
  const TimeSlot = ({ time, isSelected, onClick, isDisabled = false }: {
    time: string;
    isSelected: boolean;
    onClick: () => void;
    isDisabled?: boolean;
  }) => {
    let bgColor = 'var(--color-grey-950)';
    let textColor = 'var(--color-white)';
    let borderColor = 'var(--color-grey-850)';

    if (isSelected) {
      bgColor = 'var(--color-dark-purple)';
      textColor = 'var(--color-white)';
      borderColor = 'var(--color-purple)';
    } else if (isDisabled) {
      bgColor = 'var(--color-grey-850)';
      textColor = 'var(--color-grey-650)';
      borderColor = 'var(--color-black)';
    }

    return (
      <button
        className={`px-4 py-2 rounded-lg text-sm transition-all label1`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: borderColor,
          borderWidth: '1.5px',
          borderStyle: 'solid',
          fontWeight: 'var(--font-weight-medium)'
        }}
        onClick={onClick}
        disabled={isDisabled}
      >
        {time}
      </button>
    );
  };
  
  const DesignerCard = ({ designer, isSelected, onClick }: {
    designer: Designer;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all`}
      style={{
        borderColor: isSelected ? 'var(--color-purple)' : 'var(--color-grey-850)',
        backgroundColor: isSelected ? 'var(--color-dark-purple)' : 'var(--color-black)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div 
          className="w-24 h-24 rounded-md flex-shrink-0 relative overflow-hidden flex items-center justify-center bg-cover bg-center"
          style={{ 
            backgroundImage: designer.profileImageUrl ? `url(${designer.profileImageUrl})` : 'none',
            backgroundColor: 'var(--color-grey-350)'
          }}
        >
          {!designer.profileImageUrl && (
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-grey-650)' }}>
              <span className="text-xl" style={{ color: 'var(--color-white)' }}>
                {designer.name ? designer.name.charAt(0) : '?'}
              </span>
            </div>
          )}
          
          {isSelected && (
            <div className="absolute inset-0 bg-purple-500 bg-opacity-50 flex items-center justify-center rounded-md">
              <Check className="w-10 h-10" style={{ color: 'var(--color-white)' }} />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <h4 className="label1 flex items-center mb-1" style={{ color: 'var(--color-white)', fontWeight: 'var(--font-weight-semibold)' }}>
            {designer.isOwner && (
              <span className="caption2 px-2 py-0.5 rounded-full mr-2" style={{ backgroundColor: 'var(--color-grey-750)', color: 'var(--color-white)', fontWeight: 'var(--font-weight-medium)' }}>원장님</span>
            )}
            {designer.name || '이름 없음'}
          </h4>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
            {designer.intro || '소개가 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );

  const getMorningTimes = () => {
    return Object.keys(availableTimeSlots).filter(time => parseInt(time.split(':')[0]) < 12).sort();
  };
  const getAfternoonTimes = () => {
    return Object.keys(availableTimeSlots).filter(time => parseInt(time.split(':')[0]) >= 12).sort();
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)' }}>
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-black z-10">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="title1" style={{ color: 'var(--color-white)' }}>시술 예약하기</h1>
        <X className="w-6 h-6 cursor-pointer" onClick={() => navigate('/')} />
      </div>

      <div className="px-5 py-4 pb-32">
        <div className="mb-8">
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>시술 일시</h2>
          
          <div className="flex items-center justify-center mb-6">
            <ChevronLeft className="w-5 h-5 cursor-pointer" style={{ color: 'var(--color-grey-450)' }} onClick={handlePrevMonth} />
            <span className="title1 mx-4" style={{ color: 'var(--color-white)' }}>
              {`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
            </span>
            <ChevronRight className="w-5 h-5 cursor-pointer" style={{ color: 'var(--color-grey-450)' }} onClick={handleNextMonth} />
          </div>

          {isLoading ? (
            <p className="text-center" style={{ color: 'var(--color-grey-450)' }}>달력을 불러오는 중...</p>
          ) : (
            <div className="grid grid-cols-7 gap-1 mb-6">
              {generateCalendar()}
            </div>
          )}
        </div>

        {selectedDate && (
          <div className="mb-8">
            <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>오전</h3>
            {isTimeSlotsLoading ? (
              <p className="text-center" style={{ color: 'var(--color-grey-450)' }}>시간대를 불러오는 중...</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {getMorningTimes().map((time) => (
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

            <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>오후</h3>
            {isTimeSlotsLoading ? (
               <p className="text-center" style={{ color: 'var(--color-grey-450)' }}>시간대를 불러오는 중...</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 mb-8">
                {getAfternoonTimes().map((time) => (
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
            <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>디자이너 선택</h3>
            {isDesignersLoading ? (
                <p className="text-center" style={{ color: 'var(--color-grey-450)' }}>선택하신 시간에 예약 가능한 디자이너를 찾고 있습니다...</p>
            ) : (
                <div className="space-y-4">
                    {availableDesigners.length > 0 ? (
                        availableDesigners.map((designer) => (
                            <DesignerCard
                                key={designer.id}
                                designer={designer}
                                isSelected={selectedDesignerId === designer.id}
                                onClick={() => setSelectedDesignerId(designer.id)}
                            />
                        ))
                    ) : (
                        <p className="text-center" style={{ color: 'var(--color-grey-450)' }}>예약 가능한 디자이너가 없습니다.</p>
                    )}
                </div>
            )}
            </div>
        )}

        {/* 참고 이미지 추가 섹션 제거됨 */}
        
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto px-5 py-4" style={{ backgroundColor: 'var(--color-black)' }}>
          <button 
              className="w-full py-4 rounded-lg label1 transition-opacity flex items-center justify-center"
              style={{
                  background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)',
                  color: 'var(--color-white)',
                  fontWeight: 'var(--font-weight-semibold)',
                  opacity: (!selectedDate || !selectedTime || !selectedDesignerId) ? 0.5 : 1,
                  cursor: (!selectedDate || !selectedTime || !selectedDesignerId) ? 'not-allowed' : 'pointer'
              }}
              disabled={!selectedDate || !selectedTime || !selectedDesignerId}
              onClick={handleNextStep}
          >
              다음으로
          </button>
      </div>
    </div>
  );
};

export default BookingPage;
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

// VERIFICATION_TAG_BOOKING_PAGE_ULTIMATE_FIX

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(18); // Figma에 18일 선택됨
  const [selectedMorningTime, setSelectedMorningTime] = useState('');
  const [selectedAfternoonTime, setSelectedAfternoonTime] = useState('1:00'); // Figma에 1:00 선택됨
  const [selectedDesigner, setSelectedDesigner] = useState('원장님 손하늘 디자이너'); // Figma에 '원장님 손하늘 디자이너' 선택됨으로 초기 설정

  const morningTimes = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonTimes = ['1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00']; // Figma에 12:00, 7:30, 8:00, 8:30 없음

  const generateCalendar = () => {
    const days = [];
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 요일 헤더
    daysOfWeek.forEach(day => {
      days.push(
        <div key={day} className="text-center caption2" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          {day}
        </div>
      );
    });

    // 9월 1일이 토요일이라고 가정 (Figma 달력 레이아웃에 맞춤)
    // 9월 1일이 토요일이므로, 이전 요일은 빈 칸으로 채움 (금요일까지 5칸)
    for (let i = 0; i < 5; i++) {
        days.push(<div key={`empty-${i}`}></div>);
    }

    const today = 17; // Figma에 17일이 오늘로 표시됨
    const totalDaysInMonth = 30; // 9월은 30일까지

    // 날짜들 (9월 기준)
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const isSelected = selectedDate === i;
      const isToday = i === today;
      let isDisabled = false; // 기본적으로 비활성화 아님

      let bgColor = 'transparent';
      let textColor = 'var(--color-white)';
      let fontWeight = 'var(--font-weight-medium)';
      let borderColor = 'transparent'; // 기본 테두리 없음

      if (isSelected) {
        bgColor = 'var(--color-dark-purple)'; // 클릭된 날짜: 보라색 원
        textColor = 'var(--color-white)';
        fontWeight = 'var(--font-weight-semibold)';
        borderColor = 'var(--color-purple) '; // 선택된 날짜 테두리
      } else if (isToday) { 
        bgColor = 'var(--color-grey-850)'; // 오늘 날짜: 진한 회색 원
        textColor = 'var(--color-white)';
        fontWeight = 'var(--font-weight-semibold)';
        borderColor = 'var(--color-grey-850)'; // 오늘 날짜 테두리
      } else if (i < today) { // 오늘 이전의 날짜
        textColor = 'var(--color-grey-650)'; // 비활성화된 회색 숫자
        isDisabled = true;
      } else { // 오늘 이후의 날짜 (선택된 날짜 제외)
        textColor = 'var(--color-white)'; // 흰색 숫자
      }
      
      days.push(
        <div
          key={i}
          className={`text-center py-2.5 text-sm cursor-pointer rounded-full transition-all label1`}
          style={{
            color: textColor,
            backgroundColor: bgColor,
            borderColor: borderColor, // 테두리 색상 적용
            borderWidth: (isSelected || isToday) ? '1.5px' : '0', // 선택/오늘일 때만 테두리 두께 적용
            borderStyle: 'solid',
            fontWeight: fontWeight
          }}
          onClick={() => !isDisabled && setSelectedDate(i)}
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
    let bgColor = 'var(--color-grey-950)'; // Default unselected
    let textColor = 'var(--color-white)';
    let borderColor = 'var(--color-grey-850)'; // Default unselected border (lighter grey than background)

    if (isSelected) {
      bgColor = 'var(--color-dark-purple)';
      textColor = 'var(--color-white)';
      borderColor = 'var(--color-purple)'; // Darker purple border
    } else if (isDisabled) {
      bgColor = 'var(--color-grey-850)'; // Disabled background
      textColor = 'var(--color-grey-650)'; // Disabled text
      borderColor = 'var(--color-black)'; // Darkest grey border (Figma color-grey-1000에 가까움)
    }

    return (
      <button
        className={`px-4 py-2 rounded-lg text-sm transition-all label1`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: borderColor, // Apply border color
          borderWidth: '1.5px', // Apply border width (Figma에 맞춰 1.5px)
          borderStyle: 'solid', // Apply border style
          fontWeight: 'var(--font-weight-medium)'
        }}
        onClick={onClick}
        disabled={isDisabled}
      >
        {time}
      </button>
    );
  };

  const DesignerCard = ({ name, description, isSelected, onClick }: {
    name: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all`}
      style={{
        // 사용자 요청에 따라 색상 변경: Primary/Purple 배경, Secondary/Dark Purple 테두리
        borderColor: isSelected ? 'var(--color-dark-purple)' : 'var(--color-grey-850)', // 선택 시 Dark Purple 테두리
        backgroundColor: isSelected ? 'var(--color-purple)' : 'var(--color-black)' // 선택 시 Primary Purple 배경
      }}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3"> {/* items-start로 변경하여 이미지와 텍스트 상단 정렬 */}
        {/* 디자이너 이미지 플레이스홀더 및 체크마크 */}
        <div 
          className="w-24 h-24 rounded-md flex-shrink-0 relative overflow-hidden flex items-center justify-center" // w-24 h-24, rounded-md (네모)
          style={{ 
            backgroundColor: isSelected ? 'var(--color-light-purple)' : 'var(--color-grey-350)' // 선택 시 보라색 배경
          }}
        >
            {/* Figma의 투명한 격자무늬 패턴 재현 (선택되지 않았을 때만) */}
            {!isSelected && (
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                }}></div>
            )}
            {/* 선택 시 흰색 체크마크 */}
            {isSelected && (
                <Check className="w-10 h-10" style={{ color: 'var(--color-white)' }} /> // 체크마크 크기 조정
            )}
        </div>
        <div className="flex-1 flex flex-col"> {/* 설명 텍스트를 세로로 정렬 */}
          <h4 className="label1 flex items-center mb-1" style={{ color: 'var(--color-white)', fontWeight: 'var(--font-weight-semibold)' }}> {/* mb-1로 이름 아래 간격 추가 */}
            {/* '원장님' 태그 조건부 렌더링 */}
            {name.startsWith('원장님') && (
                <span className="caption2 px-2 py-0.5 rounded-full mr-2" style={{ backgroundColor: 'var(--color-grey-750)', color: 'var(--color-white)', fontWeight: 'var(--font-weight-medium)' }}>원장님</span>
            )}
            {name.replace('원장님 ', '')} {/* '원장님' 텍스트 제거 후 이름 표시 */}
          </h4>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}> {/* Font style refined */}
            {description.split('#')[1] && `#${description.split('#')[1]}`} {/* 첫 번째 #태그만 표시 */}
          </p>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}> {/* Font style refined */}
            {description.split('#')[2] && `#${description.split('#')[2]}`} {/* 두 번째 #태그만 표시 */}
          </p>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}> {/* Font style refined */}
            {description.split('#')[3] && description.split('#')[3]} {/* 나머지 설명 */}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)', fontSize: '16px', fontWeight: '600' }}>
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L5.8 12l-.65-1.05zM7.2 12l-.65 1.05L7.4 14.5l.85-1.48L7.2 12zm2.8 0l-.65 1.05L10.2 14.5l.85-1.48L10 12zm2.8 0l-.65 1.05L12.8 14.5l.85-1.48L12.8 12zm2.8 0l-.65 1.05L15.6 14.5l.85-1.48L15.6 12zm2.8 0l-.65 1.05L18.4 14.5l.85-1.48L18.4 12z"/>
          </svg>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-full h-full bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--color-black)' }}>
        <ChevronLeft className="w-6 h-6" style={{ color: 'var(--color-white)' }} />
        <h1 className="title1" style={{ color: 'var(--color-white)' }}>시술 예약하기</h1>
        <X className="w-6 h-6" style={{ color: 'var(--color-white)' }} />
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>시술 일시</h2>
          
          {/* Month Navigator */}
          <div className="flex items-center justify-center mb-6">
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-grey-450)' }} />
            <span className="title1 mx-4" style={{ color: 'var(--color-white)' }}>2024년 9월</span>
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-grey-450)' }} />
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {generateCalendar()}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>오전</h3>
          <div className="grid grid-cols-4 gap-2 mb-6"> {/* grid-cols-4로 변경 */}
            {morningTimes.map((time) => (
              <TimeSlot
                key={time}
                time={time}
                isSelected={selectedMorningTime === time}
                onClick={() => {
                  setSelectedMorningTime(time);
                  setSelectedAfternoonTime('');
                }}
                isDisabled={time === '11:30'} // Figma에 11:30 비활성화
              />
            ))}
          </div>

          <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>오후</h3>
          <div className="grid grid-cols-4 gap-2 mb-8"> {/* grid-cols-4로 변경 */}
            {afternoonTimes.map((time) => (
              <TimeSlot
                key={time}
                time={time}
                isSelected={selectedAfternoonTime === time}
                onClick={() => {
                  setSelectedAfternoonTime(time);
                  setSelectedMorningTime('');
                }}
                isDisabled={['3:00', '3:30'].includes(time)} // Figma에 3:00, 3:30 비활성화
              />
            ))}
          </div>
        </div>

        {/* Designer Selection */}
        <div className="mb-32"> {/* 하단 버튼 공간 확보를 위해 mb-32 */}
          <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>디자이너 선택</h3>
          <div className="space-y-4">
            <DesignerCard
              name="원장님 손하늘 디자이너"
              description="#연장맛집 #유지력최고 인생을 디자인합니다. 당신의 모든 취향을 실현시켜 드릴게요 :)"
              isSelected={selectedDesigner === '원장님 손하늘 디자이너'}
              onClick={() => setSelectedDesigner('원장님 손하늘 디자이너')}
            />
            <DesignerCard
              name="손하늘 디자이너"
              description="#연장맛집 #유지력최고 인생을 디자인합니다. 당신의 모든 취향을 실현시켜 드릴게요 :)"
              isSelected={selectedDesigner === '손하늘 디자이너'}
              onClick={() => setSelectedDesigner('손하늘 디자이너')}
            />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto px-5 py-4" style={{ backgroundColor: 'var(--color-black)' }}>
          <button className="w-full py-4 rounded-lg label1" 
                  style={{ 
                    background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)',
                    color: 'var(--color-white)',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}>
            다음으로
          </button> 
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

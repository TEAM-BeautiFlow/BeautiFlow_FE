import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(17);
  const [selectedMorningTime, setSelectedMorningTime] = useState('');
  const [selectedAfternoonTime, setSelectedAfternoonTime] = useState('');
  const [selectedDesigner, setSelectedDesigner] = useState('손하늘');

  const morningTimes = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonTimes = ['12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00'];

  const generateCalendar = () => {
    const days = [];
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 요일 헤더
    daysOfWeek.forEach(day => {
      days.push(
        <div key={day} className="text-center text-gray-400 text-sm py-2">
          {day}
        </div>
      );
    });

    // 날짜들 (9월 기준)
    for (let i = 1; i <= 30; i++) {
      days.push(
        <div
          key={i}
          className={`text-center py-3 text-sm cursor-pointer rounded-full transition-all ${
            selectedDate === i
              ? 'bg-purple-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => setSelectedDate(i)}
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
  }) => (
    <button
      className={`px-4 py-2 rounded-lg text-sm transition-all ${
        isSelected
          ? 'bg-purple-500 text-white'
          : isDisabled
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {time}
    </button>
  );

  const DesignerCard = ({ name, isSelected, onClick }: {
    name: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-gray-600 bg-gray-800/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <h4 className="text-white font-medium">{name} 디자이너</h4>
          <p className="text-gray-400 text-sm">
            #연장없인 #뷰티지환고
            <br />
            안녕하세요. 디자이너입니다. 당신의 모든 취향을 실현시켜 드릴게요 :)
          </p>
        </div>
        {isSelected && (
          <Check className="w-5 h-5 text-purple-400" />
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-black min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-black text-white text-sm font-medium">
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
      <div className="bg-black px-4 py-4 flex items-center space-x-4">
        <ChevronLeft className="w-6 h-6 text-white" />
        <h1 className="text-white text-lg font-medium">시술 예약하기</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="text-white text-xl font-medium mb-4">시술 일시</h2>
          
          {/* Month Navigator */}
          <div className="flex items-center justify-center mb-6">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <span className="text-white text-lg font-medium mx-4">2024년 9월</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {generateCalendar()}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-medium mb-4">오전</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {morningTimes.map((time) => (
              <TimeSlot
                key={time}
                time={time}
                isSelected={selectedMorningTime === time}
                onClick={() => {
                  setSelectedMorningTime(time);
                  setSelectedAfternoonTime('');
                }}
                isDisabled={time === '11:30'}
              />
            ))}
          </div>

          <h3 className="text-white text-lg font-medium mb-4">오후</h3>
          <div className="grid grid-cols-4 gap-2 mb-8">
            {afternoonTimes.map((time) => (
              <TimeSlot
                key={time}
                time={time}
                isSelected={selectedAfternoonTime === time}
                onClick={() => {
                  setSelectedAfternoonTime(time);
                  setSelectedMorningTime('');
                }}
                isDisabled={['3:00', '3:30'].includes(time)}
              />
            ))}
          </div>
        </div>

        {/* Designer Selection */}
        <div className="mb-32">
          <h3 className="text-white text-lg font-medium mb-4">디자이너 선택</h3>
          <div className="space-y-4">
            <DesignerCard
              name="손하늘"
              isSelected={selectedDesigner === '손하늘'}
              onClick={() => setSelectedDesigner('손하늘')}
            />
            <DesignerCard
              name="손하늘"
              isSelected={selectedDesigner === '손하늘2'}
              onClick={() => setSelectedDesigner('손하늘2')}
            />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="w-full max-w-sm px-2">
          <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg text-base font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
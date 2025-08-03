import React, { useState } from 'react';
import { ChevronLeft, Home, User, MessageSquare, Calendar, MoreHorizontal, Clock, ChevronDown } from 'lucide-react';
import '../../styles/color-system.css'; // 색상 시스템 임포트
import '../../styles/type-system.css'; // 타입 시스템 임포트

const OwnerBusinessHoursPage = () => {
  const [businessHoursStart, setBusinessHoursStart] = useState('');
  const [businessHoursEnd, setBusinessHoursEnd] = useState('');
  const [breakTimeStart, setBreakTimeStart] = useState('');
  const [breakTimeEnd, setBreakTimeEnd] = useState('');
  const [regularHolidayCycle, setRegularHolidayCycle] = useState('');
  const [regularHolidayDay, setRegularHolidayDay] = useState('');

  const handleSave = () => {
    console.log('영업 시간 저장:', { 
      businessHoursStart, 
      businessHoursEnd, 
      breakTimeStart, 
      breakTimeEnd, 
      regularHolidayCycle, 
      regularHolidayDay 
    });
    // 여기에 실제 저장 로직 (API 호출 등)을 구현합니다.
  };

  // 시간 드롭다운 옵션 생성 (예시)
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  // 주기 드롭다운 옵션 (예시)
  const holidayCycleOptions = ['매주', '매월 첫째주', '매월 둘째주', '매월 셋째주', '매월 넷째주'];
  // 요일 드롭다운 옵션 (예시)
  const holidayDayOptions = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];


  const TimeDropdown = ({ value, onChange, placeholder }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, placeholder: string }) => (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          backgroundColor: 'var(--color-grey-850)',
          border: '1px solid var(--color-grey-750)',
          borderRadius: '8px',
          padding: '16px',
          color: value ? 'var(--color-white)' : 'var(--color-grey-450)',
          fontSize: '14px',
          fontFamily: 'Pretendard, sans-serif',
          outline: 'none',
          appearance: 'none', // 기본 드롭다운 화살표 숨기기
          paddingRight: '40px' // 화살표 공간 확보
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {generateTimeOptions().map(time => (
          <option key={time} value={time} style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>
            {time}
          </option>
        ))}
      </select>
      <ChevronDown size={20} style={{ color: 'var(--color-grey-450)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );

  const CustomDropdown = ({ value, onChange, options, placeholder }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], placeholder: string }) => (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          backgroundColor: 'var(--color-grey-850)',
          border: '1px solid var(--color-grey-750)',
          borderRadius: '8px',
          padding: '16px',
          color: value ? 'var(--color-white)' : 'var(--color-grey-450)',
          fontSize: '14px',
          fontFamily: 'Pretendard, sans-serif',
          outline: 'none',
          appearance: 'none', // 기본 드롭다운 화살표 숨기기
          paddingRight: '40px' // 화살표 공간 확보
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option} style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={20} style={{ color: 'var(--color-grey-450)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );


  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ 
      backgroundColor: 'var(--color-black)',
      color: 'var(--color-white)',
      fontFamily: 'Pretendard, sans-serif' // Pretendard 폰트 적용
    }}>
      {/* Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            <div style={{ width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            <div style={{ width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            <div style={{ width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            <div style={{ width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></div>
          </div>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <rect x="1" y="3" width="18" height="6" rx="2" stroke="white" strokeWidth="1"/>
            <rect x="20" y="4" width="2" height="4" rx="1" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px 24px', // Figma에 맞춰 패딩 조정
        marginTop: '8px' // Figma에 맞춰 마진 조정
      }}>
        <ChevronLeft size={24} color="var(--color-white)" />
        <h1 className="title1" style={{ color: 'var(--color-white)', margin: 0 }}>
          영업 시간
        </h1>
        <button className="label1" style={{ color: 'var(--color-light-purple)', fontWeight: 'var(--font-weight-semibold)' }} onClick={handleSave}>
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 20px 32px' }}> {/* Figma에 맞춰 패딩 조정 */}
        {/* 영업 시간 섹션 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="businessHours" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            영업 시간 <span style={{ color: 'var(--color-status-red)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TimeDropdown 
              value={businessHoursStart} 
              onChange={(e) => setBusinessHoursStart(e.target.value)} 
              placeholder="시작" 
            />
            <TimeDropdown 
              value={businessHoursEnd} 
              onChange={(e) => setBusinessHoursEnd(e.target.value)} 
              placeholder="끝" 
            />
          </div>
        </div>

        {/* 브레이크 타임 섹션 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="breakTime" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            브레이크 타임
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TimeDropdown 
              value={breakTimeStart} 
              onChange={(e) => setBreakTimeStart(e.target.value)} 
              placeholder="시작" 
            />
            <TimeDropdown 
              value={breakTimeEnd} 
              onChange={(e) => setBreakTimeEnd(e.target.value)} 
              placeholder="끝" 
            />
          </div>
        </div>

        {/* 정기 휴무일 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <label htmlFor="regularHoliday" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            정기 휴무일
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomDropdown 
              value={regularHolidayCycle} 
              onChange={(e) => setRegularHolidayCycle(e.target.value)} 
              options={holidayCycleOptions} 
              placeholder="주기" 
            />
            <CustomDropdown 
              value={regularHolidayDay} 
              onChange={(e) => setRegularHolidayDay(e.target.value)} 
              options={holidayDayOptions} 
              placeholder="요일 지정" 
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto flex justify-around items-center py-3" style={{ backgroundColor: 'var(--color-black)', borderTop: '1px solid var(--color-grey-850)' }}>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <Calendar size={24} />
          예약
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <User size={24} />
          고객
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <MessageSquare size={24} />
          채팅
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-light-purple)' }}>
          <Home size={24} />
          매장
        </button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <MoreHorizontal size={24} />
          더보기
        </button>
      </nav>
    </div>
  );
};

export default OwnerBusinessHoursPage;

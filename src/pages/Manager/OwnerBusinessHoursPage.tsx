import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronDown } from 'lucide-react';
// Assuming these are globally available or imported in a parent component
// import '../../styles/color-system.css';
// import '../../styles/type-system.css';

// API 상수 정의
// API 기본 URL을 실제 사용하는 URL로 변경합니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzODc2OTc3OTYiLCJ1c2VySWQiOjYwLCJlbWFpbCI6Impvb245ODA5MjNAbmF2ZXIuY29tIiwiaWF0IjoxNzU1MTQ3NTEyLCJleHAiOjE3NTc3Mzk1MTJ9.usNX4xb-pfiBMM4TPYjlLhmwLeoa2lSFZO6O1KOvLEo";


// --- 데이터 형식 변환을 위한 맵 ---
const cycleApiMap = {
  '매주': 'WEEKLY',
  '격주' : 'BIWEEKLY',
  '매달 첫째 주': 'FIRST_WEEK',
  '매달 둘째 주': 'SECOND_WEEK',
  '매달 셋째 주': 'THIRD_WEEK',
  '매달 넷째 주': 'FOURTH_WEEK',
  '매달 다섯째 주': 'FIFTH_WEEK',
};
const cycleUiMap = Object.fromEntries(Object.entries(cycleApiMap).map(a => a.reverse()));

const dayApiMap = {
  '월요일': 'MON', '화요일': 'TUE', '수요일': 'WED',
  '목요일': 'THU', '금요일': 'FRI', '토요일': 'SAT', '일요일': 'SUN',
};
const dayUiMap = Object.fromEntries(Object.entries(dayApiMap).map(a => a.reverse()));


// --- 요일 선택 모달 컴포넌트 ---
const DaySelectionModal = ({ show, onClose, selectedDays, setSelectedDays }) => {
  if (!show) {
    return null;
  }

  const dayOptions = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  const handleDayClick = (day) => {
    setSelectedDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        // 순서대로 정렬되도록 추가
        : [...dayOptions].filter(d => [...prevDays, day].includes(d))
    );
  };

  return (
    // 모달 배경
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }} onClick={onClose}>
      {/* 모달 컨텐츠 (배경 클릭 시 닫히지 않도록 이벤트 전파 중단) */}
      <div style={{
        backgroundColor: 'var(--color-grey-850)', padding: '24px', borderRadius: '16px',
        width: '90%', maxWidth: '350px', border: '1px solid var(--color-grey-750)'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 className="title2" style={{ color: 'var(--color-white)', marginBottom: '24px', textAlign: 'center' }}>요일 선택</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          {dayOptions.map((day) => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className="body2"
              style={{
                flex: '1 1 30%', padding: '12px 0', borderRadius: '8px', border: '1px solid',
                borderColor: selectedDays.includes(day) ? 'var(--color-light-purple)' : 'var(--color-grey-750)',
                backgroundColor: selectedDays.includes(day) ? 'rgba(180, 154, 255, 0.1)' : 'transparent',
                color: selectedDays.includes(day) ? 'var(--color-light-purple)' : 'var(--color-white)',
                cursor: 'pointer',
                fontWeight: selectedDays.includes(day) ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
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
            width: '100%', padding: '16px 0', borderRadius: '8px',
            backgroundColor: 'var(--color-light-purple)', color: 'var(--color-white)',
            border: 'none', cursor: 'pointer'
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

  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');

  const [regularHolidayCycle, setRegularHolidayCycle] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Function to show custom alert
  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!shopId) return;
      try {
        const [hoursResponse, holidaysResponse] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/shops/manage/${shopId}/business-hours`, { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }),
          axios.get(`${API_BASE_URL}/shops/manage/${shopId}/holidays`, { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } })
        ]);

        if (hoursResponse.status === 'fulfilled' && hoursResponse.value.data?.data) {
          const { openTime, closeTime, breakStart, breakEnd } = hoursResponse.value.data.data;
          setOpenTime(openTime?.slice(0, 5) || '');
          setCloseTime(closeTime?.slice(0, 5) || '');
          setBreakStart(breakStart?.slice(0, 5) || '');
          setBreakEnd(breakEnd?.slice(0, 5) || '');
        } else if (hoursResponse.status === 'rejected') {
          console.error("영업 시간 로딩 중 에러 발생:", hoursResponse.reason);
        }

        if (holidaysResponse.status === 'fulfilled' && holidaysResponse.value.data?.data) {
          // API가 휴일 데이터를 배열로 반환할 것으로 예상하고 첫 번째 항목을 사용합니다.
          const holidayData = holidaysResponse.value.data.data;
          if (Array.isArray(holidayData) && holidayData.length > 0) {
            const { cycle, daysOfWeek } = holidayData[0]; // 배열의 첫 번째 객체 접근
            setRegularHolidayCycle(cycleUiMap[cycle] || '');
            setSelectedDays(daysOfWeek?.map(day => dayUiMap[day]) || []);
          } else {
            // 휴일이 설정되지 않았거나 데이터가 배열이 아닌 경우 상태를 초기화합니다.
            setRegularHolidayCycle('');
            setSelectedDays([]);
          }
        } else if (holidaysResponse.status === 'rejected') {
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

    // 영업시간 저장
    promises.push(axios.put(`${API_BASE_URL}/shops/manage/${shopId}/business-hours`, {
      openTime: openTime || null,
      closeTime: closeTime || null,
      breakStart: breakStart || null,
      breakEnd: breakEnd || null,
    }, { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }));

    // 정기휴일 저장 로직 개선
    let holidayPayload;
    if (regularHolidayCycle && selectedDays.length > 0) {
      // 주기와 요일이 모두 선택된 경우: 객체를 배열로 감싸서 전송
      holidayPayload = [{
        cycle: cycleApiMap[regularHolidayCycle],
        daysOfWeek: selectedDays.map(day => dayApiMap[day])
      }];
      promises.push(axios.put(`${API_BASE_URL}/shops/manage/${shopId}/holidays`, holidayPayload, { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }));
    } else if (!regularHolidayCycle && selectedDays.length === 0) {
      // 주기와 요일이 모두 비어있는 경우: 빈 배열을 전송하여 휴무일을 제거합니다.
      holidayPayload = [];
      promises.push(axios.put(`${API_BASE_URL}/shops/manage/${shopId}/holidays`, holidayPayload, { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }));
    } else {
      // 둘 중 하나만 선택된 경우 (유효하지 않은 상태)
      showCustomAlert("정기 휴무일을 저장하려면 주기와 요일을 모두 선택하거나 모두 비워두세요.");
      return; // 저장을 중단하고 경고
    }

    try {
      await Promise.all(promises);
      showCustomAlert("영업 정보가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("저장 실패:", error);
      // 서버에서 보낸 정확한 오류 메시지를 보여줄 수 있다면 더 좋을 것입니다.
      showCustomAlert("저장에 실패했습니다. 다시 시도해주세요. (오류: " + (error.response?.data?.message || error.message) + ")");
    }
  };

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

  const holidayCycleOptions = ['매주', '격주', '매달 첫째 주', '매달 둘째 주', '매달 셋째 주', '매달 넷째 주', '매달 다섯째 주'];

  const TimeDropdown = ({ value, onChange, placeholder }) => (
    <div style={{ position: 'relative', width: '100%' }}>
      <select value={value} onChange={onChange} className="body2" style={{
        width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
        borderRadius: '8px', padding: '16px', color: value ? 'var(--color-white)' : 'var(--color-grey-450)',
        fontFamily: 'Pretendard, sans-serif', outline: 'none', appearance: 'none', paddingRight: '40px'
      }}>
        <option value="" disabled>{placeholder}</option>
        {generateTimeOptions().map(time => <option key={time} value={time} style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>{time}</option>)}
      </select>
      <ChevronDown size={20} style={{ color: 'var(--color-grey-450)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );

  const CustomDropdown = ({ value, onChange, options, placeholder }) => (
    <div style={{ position: 'relative', width: '100%' }}>
      <select value={value} onChange={onChange} className="body2" style={{
        width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
        borderRadius: '8px', padding: '16px', color: value ? 'var(--color-white)' : 'var(--color-grey-450)',
        fontFamily: 'Pretendard, sans-serif', outline: 'none', appearance: 'none', paddingRight: '40px'
      }}>
        <option value="" disabled>{placeholder}</option>
        {options.map(option => <option key={option} value={option} style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>{option}</option>)}
      </select>
      <ChevronDown size={20} style={{ color: 'var(--color-grey-450)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1 className="title1" style={{ color: 'var(--color-white)', margin: 0 }}>영업 시간</h1>
        <button className="label1" style={{ color: 'var(--color-light-purple)', fontWeight: 'var(--font-weight-semibold)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleSave}>저장</button>
      </div>

      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>영업 시간 <span style={{ color: 'var(--color-red)' }}>*</span></label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TimeDropdown value={openTime} onChange={(e) => setOpenTime(e.target.value)} placeholder="시작" />
            <TimeDropdown value={closeTime} onChange={(e) => setCloseTime(e.target.value)} placeholder="끝" />
          </div>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>브레이크 타임</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TimeDropdown value={breakStart} onChange={(e) => setBreakStart(e.target.value)} placeholder="시작" />
            <TimeDropdown value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} placeholder="끝" />
          </div>
        </div>
        <div style={{ marginBottom: '32px' }}>
          <label className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>정기 휴무일</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{width: '100%'}}>
              <CustomDropdown value={regularHolidayCycle} onChange={(e) => setRegularHolidayCycle(e.target.value)} options={holidayCycleOptions} placeholder="주기" />
            </div>
            <div onClick={() => setIsModalOpen(true)} className="body2" style={{
              position: 'relative', width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
              borderRadius: '8px', padding: '16px', cursor: 'pointer',
              color: selectedDays.length > 0 ? 'var(--color-white)' : 'var(--color-grey-450)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {selectedDays.length > 0 ? selectedDays.join(', ') : '요일 지정'}
              <ChevronDown size={20} style={{ color: 'var(--color-grey-450)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
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

      {/* Custom Alert Modal */}
      {showAlert && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }} onClick={() => setShowAlert(false)}>
          <div style={{
            backgroundColor: 'var(--color-grey-850)', padding: '24px', borderRadius: '16px',
            width: '90%', maxWidth: '300px', border: '1px solid var(--color-grey-750)',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <p className="body1" style={{ color: 'var(--color-white)', marginBottom: '24px' }}>{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="title3"
              style={{
                width: '100%', padding: '12px 0', borderRadius: '8px',
                backgroundColor: 'var(--color-light-purple)', color: 'var(--color-white)',
                border: 'none', cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBusinessHoursPage;

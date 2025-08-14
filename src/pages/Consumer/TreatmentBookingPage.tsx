import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, X, Check } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';
import type { ApiResponse, MyReservationInfo } from '../../types/api';

// --- Helper Functions ---
const formatDuration = (minutes: number) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let result = '';
  if (h > 0) result += `${h}시간 `;
  if (m > 0) result += `${m}분`;
  return result.trim();
};

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return '';
  return `${dateStr.replace(/-/g, '.')} ${timeStr}`;
};

const TreatmentBookingPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string; }>();

  const [bookingInfo, setBookingInfo] = useState<MyReservationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreements, setAgreements] = useState({
    all: false,
    privacy: false,
    terms: false
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const ACCESS_TOKEN = "eyJhbGciOiUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzNDg4NDIwMjEiLCJ1c2VySWQiOjU4LCJpYXQiOjE3NTQ5Njk5MDAsImV4cCI6MTc1NzU2MTkwMH0.BzWPMm9rWf7IlmRSeO7xFySG6lic0NuQha2dDWt8yzY";

  useEffect(() => {
    const fetchBookingInfo = async () => {
      if (!shopId) {
        setError("매장 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
        const response = await axios.get<ApiResponse<MyReservationInfo>>(
          `${API_BASE_URL}/reservations/shops/${shopId}/my-reserv-info`,
          { headers }
        );
        if (response.data.success && response.data.data) {
          setBookingInfo(response.data.data);
        } else {
          setError(response.data.message || "예약 정보 로딩 실패");
        }
      } catch (err) {
        setError("예약 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingInfo();
  }, [shopId]);

  const handleAgreementChange = (key: 'all' | 'privacy' | 'terms') => {
    if (key === 'all') {
      const newAllState = !agreements.all;
      setAgreements({
        all: newAllState,
        privacy: newAllState,
        terms: newAllState
      });
    } else {
      const newAgreements = {
        ...agreements,
        [key]: !agreements[key]
      };
      const allChecked = newAgreements.privacy && newAgreements.terms;
      setAgreements({ ...newAgreements, all: allChecked });
    }
  };

  const isButtonEnabled = agreements.privacy && agreements.terms;

  if (isLoading) {
    return <div className="max-w-sm mx-auto min-h-screen bg-black text-white flex items-center justify-center">로딩 중...</div>;
  }
  if (error) {
    return <div className="max-w-sm mx-auto min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4">
      <p className="title2 mb-2">오류</p>
      <p className="body2 text-gray-400">{error}</p>
    </div>;
  }
  if (!bookingInfo) {
    return <div className="max-w-sm mx-auto min-h-screen bg-black text-white flex items-center justify-center">예약 정보가 없습니다.</div>;
  }

  // payInfo 데이터를 기반으로 '시술내역'을 동적으로 생성
  const payInfoItems = Object.keys(bookingInfo.payInfo || {});
  const mainTreatmentName = payInfoItems.length > 0 ? payInfoItems[0] : '시술 정보 없음';
  const optionsCount = payInfoItems.length > 1 ? payInfoItems.length - 1 : 0;
  const treatmentSummary = optionsCount > 0 ? `${mainTreatmentName} 외 ${optionsCount}개` : mainTreatmentName;

  const reservationDetails = [
    { label: '예약자명', value: bookingInfo.customerUsername },
    { label: '시술일시', value: formatDateTime(bookingInfo.reservationDate, bookingInfo.startTime) },
    { label: '소요시간', value: formatDuration(bookingInfo.durationMinutes) },
    { label: '매장이름', value: bookingInfo.shopName },
    { label: '시술자명', value: bookingInfo.designerName },
    { label: '시술내역', value: treatmentSummary },
  ];

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', paddingTop: '30px' }}>
        <ChevronLeft size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="title1">시술 예약하기</h1>
        <X size={24} className="cursor-pointer" onClick={() => navigate('/')} />
      </div>

      <div style={{ padding: '0 20px', overflowY: 'auto', height: 'calc(100vh - 160px)', paddingBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ marginBottom: '16px' }}>예약 정보</h2>
          <div style={{ backgroundColor: '#1A1A1A', borderRadius: '8px', overflow: 'hidden' }}>
            {reservationDetails.map((item, index) => (
              <div key={item.label} style={{ display: 'flex', borderBottom: index === reservationDetails.length - 1 ? 'none' : '1px solid #262626' }}>
                <div className="body2" style={{ width: '80px', padding: '12px', color: '#A3A3A3', backgroundColor: '#262626' }}>{item.label}</div>
                <div className="body2" style={{ flex: 1, padding: '12px' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ marginBottom: '16px' }}>유의사항</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="body2" style={{ color: '#A3A3A3', lineHeight: '1.5', marginBottom: '12px', position: 'relative', paddingLeft: '16px' }}>
              <span style={{ position: 'absolute', left: '0' }}>•</span> 예약을 신청하면 관리자가 보증금(예약금) 입금 여부와 해당 시간대의 가능 여부를 확인하고, 예약 상태를 변경해요
            </li>
            <li className="body2" style={{ color: '#A3A3A3', lineHeight: '1.5', marginBottom: '12px', position: 'relative', paddingLeft: '16px' }}>
              <span style={{ position: 'absolute', left: '0' }}>•</span> 예약 신청은 시술받고자하는 시간 기준 24시간 전까지 가능해요
            </li>
            <li className="body2" style={{ color: '#A3A3A3', lineHeight: '1.5', position: 'relative', paddingLeft: '16px' }}>
              <span style={{ position: 'absolute', left: '0' }}>•</span> 안내 사항을 숙지하고 샵에 방문하면 사장님의 안내를 따라주세요
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ marginBottom: '16px' }}>취소 및 환불 안내</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="body2" style={{ color: '#A3A3A3', lineHeight: '1.5', position: 'relative', paddingLeft: '16px' }}>
              <span style={{ position: 'absolute', left: '0' }}>•</span> 예약을 신청하면 관리자가 보증금(예약금) 입금 여부와 해당 시간대의 가능 여부를 확인하고, 예약 상태를 변경해요
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ marginBottom: '16px' }}>약관 동의 *</h2>
          <div onClick={() => handleAgreementChange('all')} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${agreements.all ? '#A259FF' : '#6B7280'}`, backgroundColor: agreements.all ? '#A259FF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {agreements.all && <Check size={16} />}
            </div>
            <span className="body1">모두 동의합니다</span>
          </div>

          <div style={{ paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div onClick={() => handleAgreementChange('privacy')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={16} color={agreements.privacy ? '#A259FF' : '#6B7280'} />
                <span className="body2">[필수] 개인정보 제3자 제공 동의</span>
              </div>
              <span className="caption2" style={{ color: '#A3A3A3' }}>보기</span>
            </div>
            <div onClick={() => handleAgreementChange('terms')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={16} color={agreements.terms ? '#A259FF' : '#6B7280'} />
                <span className="body2">[필수] 이용약관 동의</span>
              </div>
              <span className="caption2" style={{ color: '#A3A3A3' }}>보기</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 40px', position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '24rem', backgroundColor: 'var(--color-black)' }}>
        <button disabled={!isButtonEnabled} style={{ width: '100%', height: '56px', background: 'linear-gradient(90deg, #A259FF 0%, #E2ABFF 100%)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: isButtonEnabled ? 1 : 0.5, transition: 'opacity 0.2s' }}>
          결제 정보 확인하기
        </button>
      </div>
    </div>
  );
};

export default TreatmentBookingPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, X, Copy } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';
import type { ApiResponse, MyReservationInfo } from '../../types/api';

const formatDateTimeDuration = (dateStr: string, timeStr: string, minutes: number) => {
  if (!dateStr || !timeStr) return '';
  const date = dateStr.replace(/-/g, '.');
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let duration = '';
  if (h > 0) duration += `${h}시간 `;
  if (m > 0) duration += `${m}분`;
  return `${date} ${timeStr} | ${duration.trim()}`;
};

const ReservationCheck = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  const [bookingInfo, setBookingInfo] = useState<MyReservationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzNDg4NDIwMjEiLCJ1c2VySWQiOjU4LCJpYXQiOjE3NTQ5Njk5MDAsImV4cCI6MTc1NzU2MTkwMH0.BzWPMm9rWf7IlmRSeO7xFySG6lic0NuQha2dDWt8yzY";

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
        const response = await axios.get<ApiResponse<MyReservationInfo>>(`${API_BASE_URL}/reservations/shops/${shopId}/my-reserv-info`, { headers });
        if (response.data.success && response.data.data) {
          setBookingInfo(response.data.data);
        } else {
          setError(response.data.message || "정보 로딩 실패");
        }
      } catch (err) {
        setError("정보를 불러오는 중 오류 발생");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingInfo();
  }, [shopId]);

  const handleCopy = () => {
    if (!bookingInfo?.shopAccountInfo) return;
    const accountInfo = `${bookingInfo.shopAccountInfo.bank} ${bookingInfo.shopAccountInfo.accountNumber}`;
    navigator.clipboard.writeText(accountInfo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  if (isLoading) return <div className="max-w-sm mx-auto min-h-screen bg-black text-white flex items-center justify-center">로딩 중...</div>;
  if (error) return <div className="max-w-sm mx-auto min-h-screen bg-black text-white flex items-center justify-center text-center p-4">오류가 발생했습니다:<br/>{error}</div>;
  if (!bookingInfo) return <div className="max-w-sm mx-auto min-h-screen bg-black text-white flex items-center justify-center">예약 정보가 없습니다.</div>;

  const { payInfo, reservationDate, startTime, durationMinutes, customerUsername, shopAccountInfo } = bookingInfo;

  const payInfoItems = Object.entries(payInfo || {});
  const mainTreatment = payInfoItems.length > 0 ? { label: payInfoItems[0][0], price: payInfoItems[0][1] } : { label: '기본 시술', price: 0 };
  const optionTreatments = payInfoItems.slice(1).map(([label, price]) => ({ label, price }));

  const totalAmount = payInfoItems.reduce((sum, [, price]) => sum + price, 0);

  // --- (수정) 예약금을 30000원으로 고정합니다. ---
  const amountToPayNow = 30000;
  const amountToPayAtShop = totalAmount - amountToPayNow;
  // ---------------------------------------------

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', paddingTop: '30px' }}>
        <ChevronLeft size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="title1">시술 예약하기</h1>
        <X size={24} className="cursor-pointer" onClick={() => navigate('/')} />
      </div>

      <div style={{ padding: '0 20px', overflowY: 'auto', height: 'calc(100vh - 160px)', paddingBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ marginBottom: '16px' }}>결제 금액</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <p className="label1" style={{ marginBottom: '4px' }}>{mainTreatment.label}</p>
            <p className="caption2" style={{ color: 'var(--color-grey-450)' }}>
              {formatDateTimeDuration(reservationDate, startTime, durationMinutes)}
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--color-grey-850)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--color-grey-750)' }}>
              <div className="body2" style={{ color: 'var(--color-grey-450)' }}>기본시술</div>
              <div className="body2">{mainTreatment.price.toLocaleString()}원</div>
            </div>
            {optionTreatments.map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--color-grey-750)' }}>
                <div className="body2" style={{ color: 'var(--color-grey-450)' }}>{item.label}</div>
                <div className="body2">{item.price.toLocaleString()}원</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px' }}>
              <div className="body2" style={{ color: 'var(--color-light-purple)' }}>예약금액</div>
              {/* --- (수정) 예약금액 표시도 30,000원으로 고정 --- */}
              <div className="body2" style={{ color: 'var(--color-light-purple)' }}>- 30,000원</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="label1">매장에서 결제할 금액</span>
            <span className="label1">{amountToPayAtShop.toLocaleString()}원</span>
          </div>
          <p className="caption2" style={{ color: 'var(--color-grey-650)' }}>
            <span style={{ color: 'var(--color-purple)', marginRight: '4px' }}>ⓘ</span> 방문 후 상담을 통해 변경될 수 있습니다.
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label1">지금 결제할 금액</span>
            <span className="h1" style={{ color: 'var(--color-light-purple)' }}>{amountToPayNow.toLocaleString()}원</span>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ marginBottom: '8px' }}>결제 정보</h2>
          <p className="body2" style={{ color: 'var(--color-light-purple)', marginBottom: '16px', lineHeight: '1.5' }}>
            입금자명과 가입시 작성한 이름을 일치시켜주세요.<br />
            현재 설정 닉네임 : <span className="font-semibold" style={{ color: 'var(--color-white)' }}>{customerUsername}</span>
          </p>

          <div style={{ backgroundColor: '#1A1A1A', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p className="caption2" style={{ color: 'var(--color-grey-450)', marginBottom: '4px' }}>입금 계좌</p>
              <p className="body2" style={{ lineHeight: '1.5' }}>
                {shopAccountInfo.bank} {shopAccountInfo.accountNumber}<br />
                예금주 : {shopAccountInfo.accountHolder}
              </p>
            </div>
            <button onClick={handleCopy} style={{ backgroundColor: 'var(--color-purple)', borderRadius: '9999px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Copy size={18} />
              <span className="label2">계좌 복사</span>
            </button>
          </div>
          {copied && <p className="caption2 mt-2" style={{ color: 'var(--color-light-purple)' }}>계좌번호가 복사되었습니다!</p>}
        </div>
      </div>

      <div style={{ padding: '0 20px 40px', position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '24rem', backgroundColor: 'var(--color-black)' }}>
        <button style={{ width: '100%', height: '56px', background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: '600' }}>
          {amountToPayNow.toLocaleString()}원 입금하기
        </button>
      </div>
    </div>
  );
};

export default ReservationCheck;
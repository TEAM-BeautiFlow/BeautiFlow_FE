import React, { useState } from 'react';
import { ChevronLeft, X, Copy } from 'lucide-react';
import '../../styles/color-system.css'; // 색상 시스템 임포트
import '../../styles/type-system.css'; // 타입 시스템 임포트

const ReservationCheck = () => {
  const [copied, setCopied] = useState(false); // 계좌 복사 상태

  // 계좌 복사 핸들러
  const handleCopy = () => {
    // navigator.clipboard.writeText('신한 110203923432'); // 실제 복사 로직 (Canvas 환경에서는 제한될 수 있음)
    // document.execCommand('copy')는 iframe에서 작동하지 않을 수 있으므로, 실제 앱에서는 navigator.clipboard.writeText를 사용합니다.
    // 여기서는 단순히 상태만 변경하여 복사된 것처럼 보이게 합니다.
    console.log('계좌번호 복사: 신한 110203923432');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200); // 1.2초 후 복사 상태 초기화
  };

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
          시술 예약하기
        </h1>
        <X size={24} color="var(--color-white)" />
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 20px 32px' }}> {/* Figma에 맞춰 패딩 조정 */}
        {/* 결제 금액 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>결제 금액</h2>
          
          {/* 시술명 및 일시 (표 바깥으로 이동) */}
          <div style={{ padding: '0', marginBottom: '16px' }}> {/* Figma에 맞춰 패딩 및 마진 조정 */}
            <p className="label1" style={{ color: 'var(--color-white)', marginBottom: '4px' }}>이달의 아트 (9월)</p>
            <p className="caption2" style={{ color: 'var(--color-grey-450)' }}>2025.07.07 13:00 | 1시간 30분</p>
          </div>

          <div style={{ 
            backgroundColor: 'var(--color-grey-850)', // Figma 배경색 Greyscale/850으로 변경
            borderRadius: '8px',
            overflow: 'hidden' // border-radius 적용을 위해
          }}>
            {/* 상세 항목 */}
            {[
              { label: '기본시술', value: '50,000원' },
              { label: '젤제거', value: '없음', price: '15,000원' },
              { label: '연장개수', value: '1~5개', price: '15,000원' },
              { label: '케어/보수', value: '있음', price: '10,000원' },
              { label: '예약금액', value: '- 30,000원' }
            ].map((item, index) => (
              <div 
                key={item.label} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px', 
                  borderBottom: item.label === '예약금액' ? 'none' : '1px solid var(--color-grey-750)' // border 색상도 조정
                }}
              >
                <div className="body2" style={{ color: 'var(--color-grey-450)' }}>
                  {item.label}
                  {item.value && item.value !== item.price && ( // '없음', '1~5개' 등 추가 정보
                    <span className="ml-1" style={{ color: 'var(--color-grey-450)' }}>{item.value}</span>
                  )}
                </div>
                <div className="body2" style={{ color: 'var(--color-white)' }}>{item.price || item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 매장에서 결제할 금액 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="label1" style={{ color: 'var(--color-white)' }}>매장에서 결제할 금액</span>
            <span className="label1" style={{ color: 'var(--color-white)' }}>60,000원</span>
          </div>
          <p className="caption2" style={{ color: 'var(--color-grey-650)' }}>
            <span style={{ color: 'var(--color-purple)', marginRight: '4px' }}>ⓘ</span> 방문 후 상담을 통해 변경될 수 있습니다.
          </p>
        </div>

        {/* 지금 결제할 금액 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label1" style={{ color: 'var(--color-white)' }}>지금 결제할 금액</span>
            <span className="h1" style={{ color: 'var(--color-light-purple)' }}>30,000원</span> {/* Figma에 맞춰 h1 스타일 적용 */}
          </div>
        </div>

        {/* 결제 정보 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px' }}>결제 정보</h2>
          <p className="body2" style={{ color: 'var(--color-light-purple)', marginBottom: '16px', lineHeight: '1.5' }}>
            입금자명과 가입시 작성한 이름을 일치시켜주세요.<br />
            현재 설정 닉네임 : <span style={{ color: 'var(--color-white)', fontWeight: 'var(--font-weight-semibold)' }}>손하늘</span>
          </p>

          {/* 입금 계좌 박스 */}
          <div style={{ 
            backgroundColor: 'var(--color-grey-1000)', // Figma 배경색 #1A1A1A
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p className="caption2" style={{ color: 'var(--color-grey-450)', marginBottom: '4px' }}>입금 계좌</p>
              <p className="body2" style={{ color: 'var(--color-white)', lineHeight: '1.5' }}>
                신한 110203923432<br />
                예금주 : 손영이
              </p>
            </div>
            <button 
              onClick={handleCopy}
              style={{
                backgroundColor: 'var(--color-purple)', // Figma 배경색
                color: 'var(--color-white)',
                fontSize: '14px',
                fontWeight: 'var(--font-weight-semibold)',
                borderRadius: '9999px', // rounded-full
                padding: '8px 12px', // px-3 py-1.5
                display: 'flex',
                alignItems: 'center',
                gap: '8px', // gap-2
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <Copy size={18} />
              계좌 복사
            </button>
          </div>
          {copied && (
            <p className="caption2 mt-2" style={{ color: 'var(--color-light-purple)' }}>계좌번호가 복사되었습니다!</p>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div style={{ padding: '0 20px 40px' }}> {/* Figma에 맞춰 패딩 조정 */}
        <button style={{
          width: '100%',
          height: '56px',
          background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)', // Figma 그라데이션
          border: 'none',
          borderRadius: '8px',
          color: 'var(--color-white)',
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'Pretendard, sans-serif',
          cursor: 'pointer'
        }}>
          30,000원 입금하기
        </button>
      </div>
    </div>
  );
};

export default ReservationCheck;

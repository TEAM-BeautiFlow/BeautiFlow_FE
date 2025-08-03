import React, { useState } from 'react';
import { Home, User, MessageSquare, Calendar, MoreHorizontal, ChevronRight, ShieldAlert, CheckCircle2, Pencil, Image, DollarSign, Clock } from 'lucide-react';
import '../../styles/color-system.css'; // 색상 시스템 임포트
import '../../styles/type-system.css'; // 타입 시스템 임포트

const OwnerVerificationPage = () => {
  // 인증 상태를 관리하는 state. false: 인증 필요, true: 확인 중
  const [isVerificationInProgress, setIsVerificationInProgress] = useState(false);

  // '사업자등록증 인증 필요' 버튼 클릭 핸들러
  const handleVerificationClick = () => {
    setIsVerificationInProgress(true); // 클릭 시 '확인 중' 상태로 변경
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
      <header className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: 'var(--color-black)' }}>
        <span className="h1" style={{ color: 'var(--color-purple)' }}>BEAUTIFLOW</span>
      </header>

      {/* Profile Section */}
      <div className="px-5 py-4 flex items-center space-x-3" style={{ backgroundColor: 'var(--color-black)' }}>
        <div className="w-14 h-14 rounded-full flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="flex-1">
          <h2 className="title1" style={{ color: 'var(--color-white)' }}>뷰티플로우</h2>
          <p className="caption2" style={{ color: 'var(--color-grey-450)' }}>
            {isVerificationInProgress ? '한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개;' : '-'}
          </p>
        </div>
      </div>

      {/* Business Verification Button */}
      <button 
        className="flex items-center justify-between w-full px-5 py-4 cursor-pointer"
        style={{
          // isVerificationInProgress 값에 따라 배경색 및 텍스트/아이콘 색상 변경
          backgroundColor: isVerificationInProgress ? 'var(--color-grey-950)' : 'var(--color-status-dark-red)', 
          color: isVerificationInProgress ? 'var(--color-light-purple)' : 'var(--color-status-red)',
          border: isVerificationInProgress ? '1px solid var(--color-light-purple)' : 'none', // Figma에 따라 border: none 유지
          marginBottom: '24px' // Figma 간격
        }}
        onClick={handleVerificationClick}
        disabled={isVerificationInProgress} // 확인 중일 때는 비활성화
      >
        <div className="flex items-center gap-2">
          {isVerificationInProgress ? (
            <CheckCircle2 size={20} style={{ color: 'var(--color-light-purple)' }} />
          ) : (
            <ShieldAlert size={20} style={{ color: 'var(--color-status-red)' }} /> // 아이콘 색상도 변경
          )}
          <span className="label1">
            {isVerificationInProgress ? '사업자등록증 확인 중' : '사업자등록증 인증 필요'}
          </span>
        </div>
        <ChevronRight size={20} style={{ color: isVerificationInProgress ? 'var(--color-light-purple)' : 'var(--color-status-red)' }} /> {/* 아이콘 색상도 변경 */}
      </button>

      {/* Tabs */}
      <div className="flex border-b px-5" style={{ borderColor: 'var(--color-grey-850)', backgroundColor: 'var(--color-black)' }}>
        <button className="py-3 px-2 label1 border-b-2" style={{ borderColor: 'var(--color-light-purple)', color: 'var(--color-light-purple)', fontWeight: 'var(--font-weight-semibold)' }}>
          기본
        </button>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          시술
        </button>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          공지사항
        </button>
      </div>

      {/* Content Sections */}
      <div className="px-5 py-4 flex-1 overflow-y-auto pb-20"> {/* 하단 내비바 공간 확보 */}
        {/* 매장 정보 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>매장 정보</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>뷰티플로우</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} style={{ color: 'var(--color-grey-450)' }} /> {/* 전화 아이콘 대신 MessageSquare 사용 */}
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? '02-456-7890' : '-'}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={16} style={{ color: 'var(--color-grey-450)' }} /> {/* 위치 아이콘 대신 Clock 사용 */}
              <span className="body2" style={{ color: 'var(--color-white)', lineHeight: '1.5' }}>
                {isVerificationInProgress ? '서울 종로구 삼일대로 428 낙원상가 2층 87호 2층 87호 2층 87호' : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* 매장 소개 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>매장 소개</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Pencil size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? '한 줄 소개입니다.' : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? 'imageName.png' : '-'}</span>
            </div>
          </div>
        </div>

        {/* 매출 관리 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>매출 관리</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home size={16} style={{ color: 'var(--color-grey-450)' }} /> {/* 계좌 아이콘 대신 Home 사용 */}
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? '국민 110-987-231553 손하늘' : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? '예약금 30,000원' : '-'}</span>
            </div>
          </div>
        </div>

        {/* 영업 시간 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>영업 시간</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? '평일 9:00 ~ 19:00 (월~일)' : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: 'var(--color-grey-450)' }} /> {/* 공휴일 아이콘 대신 Calendar 사용 */}
              <span className="body2" style={{ color: 'var(--color-white)' }}>{isVerificationInProgress ? '공휴일 정상영업' : '-'}</span>
            </div>
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

export default OwnerVerificationPage;

import React, { useState } from 'react';
import { Home, User, MessageSquare, Calendar, MoreHorizontal, ChevronRight, Plus, ShieldAlert, Check } from 'lucide-react';
import '../../styles/color-system.css'; // 색상 시스템 임포트
import '../../styles/type-system.css'; // 타입 시스템 임포트

const OwnerAnnouncementsPage = () => {
  // 사업자등록증 인증 상태 (Figma에 '인증 필요'로 표시됨)
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(true); 

  // 공지사항 추가 버튼 클릭 핸들러 (현재는 콘솔 로그만)
  const handleAddAnnouncement = () => {
    console.log('새 공지사항 추가 버튼 클릭');
    // 여기에 새 공지사항 추가 페이지로 이동하거나 모달을 여는 로직을 구현합니다.
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
      <div className="px-5 py-4 flex space-x-3" style={{ backgroundColor: 'var(--color-black)' }}>
        <div className="w-14 h-14 rounded-full flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center">
            <h2 className="title1" style={{ color: 'var(--color-white)', marginRight: '8px' }}>뷰티플로우</h2>
            <Check size={20} style={{ color: 'var(--color-light-purple)' }} />
          </div>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', marginTop: '4px' }}>
            한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개;
          </p>
        </div>
      </div>

      {/* Business Verification Button (Figma에 표시됨) */}
      {isVerificationNeeded && (
        <button 
          className="flex items-center justify-between w-full px-5 py-4 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-status-dark-red)', 
            color: 'var(--color-status-red)',
            marginBottom: '24px' 
          }}
          onClick={() => setIsVerificationNeeded(false)} // 클릭 시 인증 필요 상태 해제 (예시)
        >
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} style={{ color: 'var(--color-status-red)' }} />
            <span className="label1">사업자등록증 인증 필요</span>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--color-status-red)' }} />
        </button>
      )}

      {/* Tabs */}
      <div className="flex border-b px-5" style={{ borderColor: 'var(--color-grey-850)', backgroundColor: 'var(--color-black)' }}>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          기본
        </button>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          시술
        </button>
        <button className="py-3 px-2 label1 border-b-2" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)', fontWeight: 'var(--font-weight-semibold)' }}>
          공지사항
        </button>
      </div>

      {/* Announcement List Section */}
      <section className="flex-1 overflow-y-auto px-5 pb-20" style={{ backgroundColor: 'var(--color-black)' }}>
        {[1, 2].map((_, idx) => ( // Figma에 보이는 2개의 공지사항 아이템
          <div key={idx} style={{ 
            backgroundColor: 'var(--color-grey-1000)', // Figma 배경색
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '16px' // 아이템 간 간격
          }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="label1" style={{ color: 'var(--color-white)' }}>공지 사항 제목입니다</h3>
              <ChevronRight size={20} style={{ color: 'var(--color-grey-450)' }} />
            </div>
            <p className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}>
              공지 사항을 읽고 예약해주세요. 최대 2줄까지 보입니다. 나머지는 더보기를 통해 확인할 수 있습니다. 디자인은...
            </p>
          </div>
        ))}
      </section>

      {/* Floating Action Button (FAB) */}
      <button 
        className="fixed right-5 bottom-24 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-purple)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          zIndex: 1000 // 다른 요소 위에 오도록
        }}
        onClick={handleAddAnnouncement}
      >
        <Plus size={32} style={{ color: 'var(--color-white)' }} />
      </button>

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

export default OwnerAnnouncementsPage;

import React, { useState } from 'react';
import { Home, User, MessageSquare, Calendar, MoreHorizontal, Clock, Plus, Check } from 'lucide-react'; // Check 아이콘 추가
import '../../styles/color-system.css'; // 색상 시스템 임포트
import '../../styles/type-system.css'; // 타입 시스템 임포트

const OwnerTreatmentsPage = () => {
  // 현재 선택된 시술 카테고리 (손, 발, 기타)
  const [selectedCategory, setSelectedCategory] = useState('손'); 

  // 시술 추가 버튼 클릭 핸들러 (현재는 콘솔 로그만)
  const handleAddTreatment = () => {
    console.log('새 시술 추가 버튼 클릭');
    // 여기에 새 시술 추가 페이지로 이동하거나 모달을 여는 로직을 구현합니다.
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
      <div className="px-5 py-4 flex space-x-3" style={{ backgroundColor: 'var(--color-black)' }}> {/* items-center 제거 */}
        <div className="w-14 h-14 rounded-full flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="flex-1 flex flex-col"> {/* flex-col로 변경하여 세로 정렬 */}
          <div className="flex items-center"> {/* 뷰티플로우 텍스트와 체크마크를 한 줄에 */}
            <h2 className="title1" style={{ color: 'var(--color-white)', marginRight: '8px' }}>뷰티플로우</h2>
            <Check size={20} style={{ color: 'var(--color-light-purple)' }} /> {/* 체크마크 */}
          </div>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', marginTop: '4px' }}> {/* 마진 조정 */}
            한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개입니다.한줄소개;
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-5" style={{ borderColor: 'var(--color-grey-850)', backgroundColor: 'var(--color-black)' }}>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          기본
        </button>
        <button className="py-3 px-2 label1 border-b-2" style={{ borderColor: 'var(--color-light-purple)', color: 'var(--color-light-purple)', fontWeight: 'var(--font-weight-semibold)' }}>
          시술
        </button>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>
          공지사항
        </button>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 px-5 py-4" style={{ backgroundColor: 'var(--color-black)' }}>
        <button 
          className="rounded-full px-4 py-1 caption2"
          style={{
            backgroundColor: selectedCategory === '손' ? 'var(--color-dark-purple)' : 'var(--color-grey-750)',
            border: selectedCategory === '손' ? '1.5px solid var(--color-light-purple)' : 'none',
            color: selectedCategory === '손' ? 'var(--color-white)' : 'var(--color-white)'
          }}
          onClick={() => setSelectedCategory('손')}
        >
          손
        </button>
        <button 
          className="rounded-full px-4 py-1 caption2"
          style={{
            backgroundColor: selectedCategory === '발' ? 'var(--color-dark-purple)' : 'var(--color-grey-750)',
            border: selectedCategory === '발' ? '1.5px solid var(--color-light-purple)' : 'none',
            color: selectedCategory === '발' ? 'var(--color-white)' : 'var(--color-white)'
          }}
          onClick={() => setSelectedCategory('발')}
        >
          발
        </button>
        <button 
          className="rounded-full px-4 py-1 caption2"
          style={{
            backgroundColor: selectedCategory === '기타' ? 'var(--color-dark-purple)' : 'var(--color-grey-750)',
            border: selectedCategory === '기타' ? '1.5px solid var(--color-light-purple)' : 'none',
            color: selectedCategory === '기타' ? 'var(--color-white)' : 'var(--color-white)'
          }}
          onClick={() => setSelectedCategory('기타')}
        >
          기타
        </button>
      </div>

      {/* Treatment List Section */}
      <section className="flex-1 overflow-y-auto px-5 pb-20" style={{ backgroundColor: 'var(--color-black)' }}>
        {[1, 2].map((_, idx) => ( // Figma에 보이는 2개의 아이템만 렌더링
          <div key={idx} className="mb-6"> {/* 각 시술 아이템 하단 마진 24px */}
            <div className="flex items-center gap-4"> {/* 이미지와 텍스트 블록 간 간격 16px */}
              {/* 시술 이미지 플레이스홀더 */}
              <div className="w-24 h-24 rounded-md flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* 시술 상세 정보 */}
              <div className="flex-1">
                {/* 시술 항목 이름 ('이달의 아트')와 소요 시간 ('60분')을 동일 선상에 배치 */}
                <div className="flex justify-between items-center mb-1"> {/* gap-1 (4px) */}
                  <span className="label1" style={{ color: 'var(--color-white)' }}>이달의 아트</span> {/* 시술 항목 이름 */}
                  <div className="flex items-center gap-1">
                    <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
                    <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>60분</span>
                  </div>
                </div>
                
                {/* 가격 정보 */}
                <div className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px' }}>
                  34,000원
                </div>
                
                {/* 시술 설명 */}
                <p className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', margin: 0 }}>
                  9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어주세요! 9월 이달의 아트입니다....
                </p>
              </div>
            </div>
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
        onClick={handleAddTreatment}
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

export default OwnerTreatmentsPage;

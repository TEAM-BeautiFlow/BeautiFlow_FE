import React, { useState } from 'react';
import { ChevronLeft, Camera, Home, User, MessageSquare, Calendar, MoreHorizontal, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import '../../styles/color-system.css'; // 색상 시스템 임포트
import '../../styles/type-system.css'; // 타입 시스템 임포트

const OwnerBusinessRegistrationPage = () => {
  // isRegistered: false (등록 전), true (등록 후 재접속 시)
  const [isRegistered, setIsRegistered] = useState(false); 

  // 사업자등록증 업로드 버튼 클릭 핸들러 (상태 전환 예시)
  const handleUploadClick = () => {
    // 실제로는 파일 업로드 로직이 들어가고, 성공 시 상태 변경
    setIsRegistered(true); 
    console.log('사업자등록증 업로드 버튼 클릭');
  };

  // 업로드된 이미지 삭제 핸들러
  const handleDeleteImage = () => {
    setIsRegistered(false); // 이미지를 삭제하면 '등록 전' 상태로 돌아감
    console.log('업로드된 사업자등록증 이미지 삭제');
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
        justifyContent: 'flex-start', // 왼쪽 정렬 유지
        alignItems: 'center',
        padding: '0 20px 24px', // Figma에 맞춰 패딩 조정
        marginTop: '8px' // Figma에 맞춰 마진 조정
      }}>
        <ChevronLeft size={24} color="var(--color-white)" />
        <h1 className="title1" style={{ color: 'var(--color-white)', margin: '0 auto', textAlign: 'center', flexGrow: 1 }}> {/* flexGrow: 1과 margin: 0 auto로 중앙 정렬 */}
          사업자등록증
        </h1>
        {/* Figma에 X 아이콘 없음 */}
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 20px 32px' }}> {/* Figma에 맞춰 패딩 조정 */}
        {/* 사업자등록증 확인 중 / 등록 전 상태 메시지 */}
        {isRegistered && (
          <div className="label1 px-4 py-3 rounded-md mb-6" style={{ backgroundColor: 'var(--color-dark-purple)', color: 'var(--color-light-purple)', textAlign: 'center' }}> {/* 텍스트 중앙 정렬 추가 */}
            사업자등록증 확인 중
          </div>
        )}

        {/* 안내 문구 */}
        <p className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', marginBottom: '24px' }}>
          뷰티플로우 전체 서비스를 이용하기 위해서는 사업자등록증을 제출해야 해요. 1주일 내로 미제출 시 서비스 이용이 제한돼요.
        </p>

        {/* 유의사항 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>유의사항</h2>
          <div style={{ backgroundColor: 'var(--color-grey-1000)', borderRadius: '8px', padding: '16px' }}> {/* 배경색과 패딩 추가 */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', marginBottom: '12px', position: 'relative', paddingLeft: '16px' }}>
                <span style={{ position: 'absolute', left: '0' }}>•</span> 6개월 이내 발급된 사업자등록증을 제출해 주세요
              </li>
              <li className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5', position: 'relative', paddingLeft: '16px' }}>
                <span style={{ position: 'absolute', left: '0' }}>•</span> 서류 제출 시 대표자명, 생년월일, 사업의 종류, 세무서명 및 세무서날인을 제외한 정보는 가린 후 제출해 주세요.
              </li>
            </ul>
          </div>
        </div>

        {/* 사업자등록증 업로드 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px' }}>사업자등록증 업로드</h2>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', marginBottom: '16px' }}>
            업로드 후 48시간 내로 관리자가 확인할 예정입니다.
          </p>

          {/* 업로드 버튼 또는 이미지 플레이스홀더 */}
          {!isRegistered ? (
            <button 
              className="flex items-center justify-center w-full py-4 rounded-lg label1"
              style={{
                background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)',
                color: 'var(--color-white)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer'
              }}
              onClick={handleUploadClick}
            >
              <Camera size={20} style={{ marginRight: '8px' }} />
              사업자등록증 업로드
            </button>
          ) : (
            <div style={{
              width: '101px', // Figma에 보이는 이미지 크기
              height: '101px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-grey-350)', // 이미지 플레이스홀더 배경색
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ // 격자무늬 패턴
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }}></div>
              {/* 이미지 삭제 버튼 */}
              <button 
                onClick={handleDeleteImage}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-grey-750)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10 // 버튼이 이미지 위에 오도록 z-index 추가
                }}
              >
                <X size={12} color="var(--color-white)" />
              </button>
            </div>
          )}
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

export default OwnerBusinessRegistrationPage;
// VERIFICATION_TAG_V_FINAL_LAYOUT_RECONFIRM
import React, { useState } from 'react';
import { ChevronLeft, Clock, Check } from 'lucide-react';
import * as OptionsData from '../../data/options'; // 모듈 전체를 OptionsData 네임스페이스로 임포트

const TreatmentOptionsPage = () => {
  // 각 카테고리별로 선택된 옵션의 ID를 저장하는 상태
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({
    finger: 'basic', // '젤 제거'의 '없음' 옵션 ID
    toe: 'basic-toe', // '연장'의 '없음' 옵션 ID
    management: 'basic-mgmt', // '랩핑'의 '없음' 옵션 ID
  });

  // 옵션 선택 핸들러
  const handleOptionSelect = (category: keyof typeof OptionsData.optionCategories, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: optionId
    }));
  };

  // 옵션 그룹 렌더링 함수
  const renderOptionGroup = (category: keyof typeof OptionsData.optionCategories, title: string) => (
    <div className="mb-6">
      {/* 옵션 카테고리 제목 */}
      <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>{title}</h3>
      <div className="space-y-2">
        {OptionsData.optionCategories[category].map((option: OptionsData.Option) => ( // OptionsData.Option으로 접근
          <div
            key={option.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer`}
            style={{
              borderColor: selectedOptions[category] === option.id ? 'var(--color-light-purple)' : 'var(--color-grey-850)',
              backgroundColor: selectedOptions[category] === option.id ? 'var(--color-dark-purple)' : 'var(--color-black)'
            }}
            onClick={() => handleOptionSelect(category, option.id)}
          >
            <div className="flex items-start space-x-3">
              {/* 라디오 버튼 */}
              <div 
                className="flex-shrink-0 mt-1"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all`}
                  style={{
                    borderColor: selectedOptions[category] === option.id ? 'var(--color-light-purple)' : 'var(--color-grey-450)',
                    backgroundColor: selectedOptions[category] === option.id ? 'var(--color-light-purple)' : 'transparent'
                  }}>
                  {selectedOptions[category] === option.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-white)' }}></div>
                  )}
                </div>
              </div>
              
              {/* 옵션 내용: 이름, 가격, 시간 박스, 설명이 세로로 쌓이도록 flex-col 적용 */}
              <div className="flex-1 flex flex-col">
                {/* 첫 번째 줄: 옵션 이름과 (조건부) 가격 */}
                <div className="flex justify-between items-center">
                  <span className="label1" style={{ color: 'var(--color-white)' }}>{option.name}</span>
                  {/* option.time이 없는 경우에만 가격을 여기에 표시 */}
                  {!option.time && (
                    <span className="body1" style={{ color: 'var(--color-white)' }}>{option.price}</span>
                  )}
                </div>
                
                {/* 두 번째 줄 (조건부): 시간 박스 옆에 가격 */}
                {option.time && ( // option.time이 있을 때만 렌더링
                  <div className="flex items-center mt-1"> {/* 시간 박스와 가격을 포함하는 flex 컨테이너 */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ backgroundColor: '#3A3A3A', width: 'fit-content' }}>
                      <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
                      <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>
                        {option.time} {/* time 속성 직접 사용 */}
                      </span>
                    </div>
                    {/* 가격을 시간 박스 바로 옆에 배치, 배경 없음 */}
                    <span className="body1 ml-1" style={{ color: 'var(--color-white)' }}>{option.price}</span>
                  </div>
                )}
                
                {/* 세 번째 줄: 옵션 설명 */}
                {/* 시간 박스 유무에 따라 상단 마진 조정 */}
                <p className="body2" style={{ 
                  color: 'var(--color-grey-450)', 
                  lineHeight: '1.5', 
                  marginTop: option.time ? '8px' : '4px' 
                }}>
                  {option.description} {/* description 필드는 이제 순수 설명만 포함 */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)', fontSize: '16px', fontWeight: '600' }}>
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
      <div className="px-4 py-3 flex items-center" style={{ backgroundColor: 'var(--color-black)' }}>
        <ChevronLeft className="w-6 h-6" style={{ color: 'var(--color-white)' }} />
        <h1 className="title1 flex-1 text-center" style={{ color: 'var(--color-white)' }}>옵션 선택하기</h1>
        {/* Figma에 X 아이콘이 없으므로 제거 */}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Treatment Info */}
        <div className="mb-8"> {/* Figma 간격에 맞춰 mb-8 */}
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>시술 정보</h2>
          <div className="flex space-x-4"> {/* Figma 간격에 맞춰 space-x-4 */}
            <div className="w-24 h-24 rounded-md flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
              {/* Figma의 투명한 격자무늬 패턴 재현 */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            <div className="flex-1">
              {/* 시술 정보의 '60분'에 배경색 추가 */}
              <div className="flex items-center gap-1 mb-1"> {/* Figma 간격에 맞춰 gap-1, mb-1 */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ backgroundColor: '#3A3A3A' }}> {/* 배경색 추가 */}
                  <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
                  <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>소요시간 | 60분</span> {/* Figma에 '60분'만 표시 */}
                </div>
              </div>
              <div className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px' }}>
                34,000원 ~ 47,000원
              </div>
              <p className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}>
                9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어주세요!
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mb-20"> {/* 하단 버튼 공간 확보를 위해 mb-20 */}
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>옵션 선택</h2>
          {renderOptionGroup('finger', '젤 제거')}
          {renderOptionGroup('toe', '연장')}
          {renderOptionGroup('management', '랩핑')} {/* Figma에 '랩핑'으로 표시 */}
        </div>
      </div>

      {/* Bottom Button - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto px-5 py-4" style={{ backgroundColor: 'var(--color-black)' }}>
        <button className="w-full py-4 rounded-lg label1" 
                style={{ 
                  background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)',
                  color: 'var(--color-white)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
          예약하기
        </button>
      </div>
    </div>
  );
};

export default TreatmentOptionsPage;

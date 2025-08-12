import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus, Camera, Home, User, MessageSquare, Calendar, MoreHorizontal, ChevronDown, X } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';

interface TreatmentOption {
  id: number;
  name: string;
  time: number;
  price: number;
}

const OwnerEditTreatmentPage = () => {
  const [treatmentName, setTreatmentName] = useState('이달의 아트 (9월)');
  const [category, setCategory] = useState('손');
  const [price, setPrice] = useState('45000');
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState('시술 설명 텍스트입니다. 몇 자가 최대글자수? 궁금하다. 더 자세한 내용은 기능명세서를 참고해주세요. 다른 설명도');
  const [mainImage, setMainImage] = useState<string | null>(null);

  const [options, setOptions] = useState<TreatmentOption[]>([
    { id: 1, name: '케어', time: 30, price: 0 }, // Figma 초기값 반영
    { id: 2, name: '스케일링', time: 60, price: 0 }, // Figma 초기값 반영
  ]);
  const [nextOptionId, setNextOptionId] = useState(3);

  const MAX_LENGTH_NAME = 50;
  const MAX_LENGTH_PRICE = 10;
  const MAX_LENGTH_DESCRIPTION = 500;

  const handleSave = () => {
    console.log('시술 수정 저장:', {
      treatmentName,
      category,
      price,
      duration,
      description,
      mainImage,
      options
    });
  };

  const handleDurationChange = (type: 'increase' | 'decrease') => {
    setDuration(prev => {
      if (type === 'increase') return prev + 10;
      if (type === 'decrease' && prev >= 10) return prev - 10;
      return prev;
    });
  };

  const handleOptionChange = (id: number, field: keyof TreatmentOption, value: any) => {
    setOptions(prev => prev.map(opt =>
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
  };

  const handleOptionDurationChange = (id: number, type: 'increase' | 'decrease') => {
    setOptions(prev => prev.map(opt => {
      if (opt.id === id) {
        if (type === 'increase') return { ...opt, time: opt.time + 10 };
        if (type === 'decrease' && opt.time >= 10) return { ...opt, time: opt.time - 10 };
      }
      return opt;
    }));
  };

  const handleOptionPriceInputChange = (id: number, value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    setOptions(prev => prev.map(opt =>
      opt.id === id ? { ...opt, price: isNaN(numericValue) ? 0 : numericValue } : opt
    ));
  };

  const addOption = () => {
    setOptions(prev => [...prev, { id: nextOptionId, name: '새 옵션', time: 0, price: 0 }]);
    setNextOptionId(prev => prev + 1);
  };

  const removeOption = (id: number) => {
    setOptions(prev => prev.filter(opt => opt.id !== id));
  };

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ 
      backgroundColor: 'var(--color-black)',
      color: 'var(--color-white)',
      fontFamily: 'Pretendard, sans-serif'
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
        padding: '0 20px 24px',
        marginTop: '8px'
      }}>
        <ChevronLeft size={24} color="var(--color-white)" />
        <h1 className="title1" style={{ color: 'var(--color-white)', margin: 0 }}>
          시술 수정하기
        </h1>
        <button className="label1" style={{ color: 'var(--color-light-purple)', fontWeight: 'var(--font-weight-semibold)' }} onClick={handleSave}>
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 20px 32px' }}>
        {/* 시술명 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="treatmentName" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            시술명 <span style={{ color: 'var(--color-status-red)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="treatmentName"
              type="text"
              placeholder="시술명을 입력해주세요"
              value={treatmentName}
              onChange={(e) => setTreatmentName(e.target.value)}
              maxLength={MAX_LENGTH_NAME}
              style={{
                width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                borderRadius: '8px', padding: '16px', color: 'var(--color-white)', fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif', outline: 'none'
              }}
            />
            <span className="caption2" style={{ position: 'absolute', bottom: '12px', right: '16px', color: 'var(--color-grey-450)' }}>
              {treatmentName.length}/{MAX_LENGTH_NAME}
            </span>
          </div>
        </div>

        {/* 카테고리 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="category" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            카테고리 <span style={{ color: 'var(--color-status-red)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                borderRadius: '8px', padding: '16px', color: 'var(--color-white)', fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif', outline: 'none', appearance: 'none', paddingRight: '40px'
              }}
            >
              <option value="손" style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>손</option>
              <option value="발" style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>발</option>
              <option value="기타" style={{ backgroundColor: 'var(--color-grey-850)', color: 'var(--color-white)' }}>기타</option>
            </select>
            <ChevronDown size={20} style={{ color: 'var(--color-grey-450)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* 가격 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="price" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            가격 <span style={{ color: 'var(--color-status-red)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="price"
              type="number"
              placeholder="가격을 입력해주세요."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              maxLength={MAX_LENGTH_PRICE}
              style={{
                width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                borderRadius: '8px', padding: '16px', color: 'var(--color-white)', fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif', outline: 'none'
              }}
            />
            <span className="caption2" style={{ position: 'absolute', bottom: '12px', right: '16px', color: 'var(--color-grey-450)' }}>
              {price.length}/{MAX_LENGTH_PRICE}
            </span>
          </div>
        </div>

        {/* 소요시간 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="duration" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            소요시간
          </label>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', marginBottom: '8px' }}>
            10분 단위로 조작 가능해요
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="duration"
              type="text"
              readOnly
              value={`${duration}분`}
              style={{
                flexGrow: 1, backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                borderRadius: '8px', padding: '16px', color: 'var(--color-white)', fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif', outline: 'none', textAlign: 'center'
              }}
            />
            <div style={{ display: 'flex', gap: '4px' }}> {/* 버튼을 가로로 묶음 */}
              <button 
                onClick={() => handleDurationChange('decrease')}
                style={{
                  backgroundColor: 'var(--color-dark-purple)', border: '1px solid var(--color-dark-purple)', // 배경색 dark-purple
                  borderRadius: '9999px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
                }}
              >
                <Minus size={20} color="var(--color-light-purple)" /> {/* 아이콘 색상 light-purple */}
              </button>
              <button 
                onClick={() => handleDurationChange('increase')}
                style={{
                  backgroundColor: 'var(--color-dark-purple)', border: '1px solid var(--color-dark-purple)', // 배경색 dark-purple
                  borderRadius: '9999px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
                }}
              >
                <Plus size={20} color="var(--color-light-purple)" /> {/* 아이콘 색상 light-purple */}
              </button>
            </div>
          </div>
        </div>

        {/* 설명글 */}
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="description" className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            설명글
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="description"
              placeholder="시술 설명 텍스트입니다. 몇 자가 최대글자수? 궁금하다. 더 자세한 내용은 기능명세서를 참고해주세요. 다른 설명도"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={MAX_LENGTH_DESCRIPTION}
              rows={5}
              style={{
                width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                borderRadius: '8px', padding: '16px', color: 'var(--color-white)', fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif', outline: 'none', resize: 'none'
              }}
            />
            <span className="caption2" style={{ position: 'absolute', bottom: '12px', right: '16px', color: 'var(--color-grey-450)' }}>
              {description.length}/{MAX_LENGTH_DESCRIPTION}
            </span>
          </div>
        </div>

        {/* 대표 이미지 */}
        <div style={{ marginBottom: '24px' }}>
          <label className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            대표 이미지
          </label>
          <p className="caption2" style={{ color: 'var(--color-grey-450)', marginBottom: '16px' }}>
            맨 처음 들어왔을 때 보여질 썸네일을 직접 지정해요
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="mainImageUpload"
              onChange={handleMainImageUpload}
            />
            <label htmlFor="mainImageUpload" style={{
              width: '80px', height: '80px', borderRadius: '8px', backgroundColor: 'var(--color-grey-850)',
              border: '1px solid var(--color-grey-750)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '4px'
            }}>
              <Plus size={20} color="var(--color-grey-450)" />
              <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>사진 등록</span>
            </label>
            {mainImage && (
              <div style={{
                width: '80px', height: '80px', borderRadius: '8px', position: 'relative', overflow: 'hidden',
                backgroundColor: 'var(--color-grey-350)'
              }}>
                <img src={mainImage} alt="대표 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setMainImage(null)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: 'var(--color-grey-750)', border: 'none', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', zIndex: 10
                  }}
                >
                  <X size={12} color="var(--color-white)" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 옵션 추가 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <label className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
            옵션 추가
          </label>
          <div className="space-y-6">
            {options.map((option, index) => (
              <div key={option.id} style={{ 
                backgroundColor: 'var(--color-grey-1000)', borderRadius: '8px', padding: '16px', position: 'relative' 
              }}>
                {/* 옵션 삭제 버튼 */}
                {options.length > 1 && (
                  <button 
                    onClick={() => removeOption(option.id)}
                    style={{
                      position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%',
                      backgroundColor: 'var(--color-grey-750)', border: 'none', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', zIndex: 10
                    }}
                  >
                    <X size={16} color="var(--color-white)" />
                  </button>
                )}

                {/* 옵션명 */}
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor={`optionName-${option.id}`} className="body1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
                    옵션명
                  </label>
                  <input
                    id={`optionName-${option.id}`}
                    type="text"
                    placeholder="옵션명을 입력해주세요"
                    value={option.name}
                    onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                    style={{
                      width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                      borderRadius: '8px', padding: '12px', color: 'var(--color-white)', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                {/* 소요 시간 (옵션) */}
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor={`optionTime-${option.id}`} className="body1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
                    소요 시간
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      id={`optionTime-${option.id}`}
                      type="text"
                      readOnly
                      value={`${option.time}분`}
                      style={{
                        flexGrow: 1, backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                        borderRadius: '8px', padding: '12px', color: 'var(--color-white)', fontSize: '14px', outline: 'none', textAlign: 'center'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}> {/* 버튼을 가로로 묶음 */}
                      <button 
                        onClick={() => handleOptionDurationChange(option.id, 'decrease')}
                        style={{
                          backgroundColor: 'var(--color-dark-purple)', border: '1px solid var(--color-dark-purple)', // 배경색 dark-purple
                          borderRadius: '9999px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
                        }}
                      >
                        <Minus size={20} color="var(--color-light-purple)" /> {/* 아이콘 색상 light-purple */}
                      </button>
                      <button 
                        onClick={() => handleOptionDurationChange(option.id, 'increase')}
                        style={{
                          backgroundColor: 'var(--color-dark-purple)', border: '1px solid var(--color-dark-purple)', // 배경색 dark-purple
                          borderRadius: '9999px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
                        }}
                      >
                        <Plus size={20} color="var(--color-light-purple)" /> {/* 아이콘 색상 light-purple */}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 가격 (옵션) - 직접 입력으로 변경 */}
                <div>
                  <label htmlFor={`optionPrice-${option.id}`} className="body1" style={{ color: 'var(--color-white)', marginBottom: '8px', display: 'block' }}>
                    가격
                  </label>
                  <input
                    id={`optionPrice-${option.id}`}
                    type="number"
                    placeholder="가격을 입력해주세요"
                    value={option.price === 0 ? '' : option.price}
                    onChange={(e) => handleOptionPriceInputChange(option.id, e.target.value)}
                    style={{
                      width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                      borderRadius: '8px', padding: '12px', color: 'var(--color-white)', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
              </div>
            ))}
            {/* 옵션 추가 버튼 */}
            <button 
              onClick={addOption}
              style={{
                width: '100%', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)',
                borderRadius: '8px', padding: '12px', color: 'var(--color-white)', fontSize: '14px',
                fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', marginTop: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center' // 아이콘과 텍스트 중앙 정렬
              }}
            >
              <Plus size={20} style={{ marginRight: '8px' }} /> {/* 아이콘을 텍스트 옆으로 이동 */}
              옵션 추가
            </button>
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

export default OwnerEditTreatmentPage;
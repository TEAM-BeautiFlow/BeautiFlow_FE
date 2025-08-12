import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Clock, Check } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';
import type { ApiResponse, TreatmentDetailWithOption, OptionGroup, OptionItem } from '../../types/api';

const TreatmentOptionsPage = () => {
  const [treatmentDetail, setTreatmentDetail] = useState<TreatmentDetailWithOption | null>(null);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { shopId, treatmentId } = useParams<{ shopId: string; treatmentId: string }>();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // ⚠️ 추가: 하드코딩된 ACCESS_TOKEN
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzNDg4NDIwMjEiLCJ1c2VySWQiOjU4LCJpYXQiOjE3NTQ5Njk5MDAsImV4cCI6MTc1NzU2MTkwMH0.BzWPMm9rWf7IlmRSeO7xFySG6lic0NuQha2dDWt8yzY";

  useEffect(() => {
    const fetchTreatmentOptions = async () => {
      if (!shopId || !treatmentId) {
        setError('유효하지 않은 URL입니다.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // ⚠️ 수정: Authorization 헤더 추가
        const headers = {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        };

        const response = await axios.get<ApiResponse<TreatmentDetailWithOption>>(
          `${API_BASE_URL}/shops/${shopId}/treatments/${treatmentId}/options`, { headers }
        );
        
        if (response.data.success && response.data.data) {
          const fetchedData = response.data.data;
          setTreatmentDetail(fetchedData);
          setOptionGroups(fetchedData.optionGroups);
          
          const initialSelectedOptions: Record<string, number> = {};
          fetchedData.optionGroups.forEach(group => {
            if (group.enabled && group.items.length > 0) {
              initialSelectedOptions[group.id.toString()] = group.items[0].id;
            }
          });
          setSelectedOptions(initialSelectedOptions);
        } else {
          setError(response.data.message || '옵션 정보 로딩 실패');
        }
      } catch (err) {
        console.error('API 호출 중 에러 발생:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("알 수 없는 에러가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatmentOptions();
  }, [shopId, treatmentId]);

  const handleOptionSelect = (groupId: number, optionId: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId.toString()]: optionId
    }));
  };

  const renderOptionGroup = (group: OptionGroup) => (
    <div className="mb-6" key={group.id}>
      <h3 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>{group.name}</h3>
      <div className="space-y-2">
        {group.items.map((option: OptionItem) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer`}
            style={{
              borderColor: selectedOptions[group.id.toString()] === option.id ? 'var(--color-light-purple)' : 'var(--color-grey-850)',
              backgroundColor: selectedOptions[group.id.toString()] === option.id ? 'var(--color-dark-purple)' : 'var(--color-black)'
            }}
            onClick={() => handleOptionSelect(group.id, option.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all`}
                  style={{
                    borderColor: selectedOptions[group.id.toString()] === option.id ? 'var(--color-light-purple)' : 'var(--color-grey-450)',
                    backgroundColor: selectedOptions[group.id.toString()] === option.id ? 'var(--color-light-purple)' : 'transparent'
                  }}>
                  {selectedOptions[group.id.toString()] === option.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-white)' }}></div>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="label1" style={{ color: 'var(--color-white)' }}>{option.name}</span>
                  {option.extraMinutes === 0 && (
                    <span className="body1" style={{ color: 'var(--color-white)' }}>{option.price}</span>
                  )}
                </div>
                
                {option.extraMinutes > 0 && (
                  <div className="flex items-center mt-1">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ backgroundColor: '#3A3A3A', width: 'fit-content' }}>
                      <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
                      <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>
                        {option.extraMinutes}분
                      </span>
                    </div>
                  </div>
                )}
                
                <p className="body2" style={{ 
                  color: 'var(--color-grey-450)', 
                  lineHeight: '1.5', 
                  marginTop: option.extraMinutes > 0 ? '8px' : '4px' 
                }}>
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
        <p>옵션 정보를 불러오는 중입니다...</p>
      </div>
    );
  }
  
  if (error || !treatmentDetail) {
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-red)' }}>
        <p>데이터 로딩에 실패했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)' }}>
      {/* ... (Status Bar) */}
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
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Treatment Info */}
        <div className="mb-8">
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>시술 정보</h2>
          <div className="flex space-x-4">
            <div className="w-24 h-24 rounded-md flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
              {treatmentDetail.images && treatmentDetail.images.length > 0 ? (
                <img src={treatmentDetail.images[0].imageUrl} alt={treatmentDetail.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px'
                }}></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ backgroundColor: '#3A3A3A' }}>
                  <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
                  <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>{treatmentDetail.durationMinutes}분</span>
                </div>
              </div>
              <div className="label1" style={{ color: 'var(--color-white)', marginBottom: '8px' }}>
                {treatmentDetail.price.toLocaleString()}원
              </div>
              <p className="body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}>
                {treatmentDetail.description}
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mb-20">
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>옵션 선택</h2>
          {optionGroups.map(group => renderOptionGroup(group))}
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
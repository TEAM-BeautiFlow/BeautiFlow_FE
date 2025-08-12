import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ChevronLeft, Clock, X } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';
import type { ApiResponse, Treatment } from '../../types/api';

const ArtDetailPage = () => {
  const [treatmentData, setTreatmentData] = useState<Treatment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { shopId, treatmentId } = useParams<{ shopId: string; treatmentId: string }>();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTreatmentDetail = async () => {
      if (!shopId || !treatmentId) {
        setError('유효하지 않은 URL입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get<ApiResponse<Treatment>>(`${API_BASE_URL}/shops/${shopId}/treatments/${treatmentId}`);

        if (response.data.success && response.data.data) {
          setTreatmentData(response.data.data);
        } else {
          setError(response.data.message || '시술 정보 로딩 실패');
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

    fetchTreatmentDetail();
  }, [shopId, treatmentId]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 버튼 클릭');
  };

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
        <p>시술 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !treatmentData) {
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-red)' }}>
        <p>데이터 로딩에 실패했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
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

      <div className="px-4 py-3" style={{ backgroundColor: 'var(--color-black)' }}>
        <ChevronLeft className="w-6 h-6" style={{ color: 'var(--color-white)' }} />
      </div>

      <div className="relative h-96 overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
        {treatmentData.images && treatmentData.images.length > 0 ? (
          <img
            src={treatmentData.images[0].imageUrl}
            alt={treatmentData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="body1" style={{ color: 'var(--color-grey-650)' }}>배너 이미지</span>
        </div>
      </div>

      <div className="px-5 py-4 flex-1" style={{ backgroundColor: 'var(--color-black)' }}>
        <h1 className="title1" style={{ color: 'var(--color-white)', marginBottom: '8px' }}>{treatmentData.name}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <span className="label1" style={{ color: 'var(--color-purple)' }}>{treatmentData.price.toLocaleString()}원</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-grey-750)' }}>
            <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
            <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>{treatmentData.durationMinutes}분</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="label1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>시술 정보</h2>
          
          <div className="space-y-4 body2" style={{ color: 'var(--color-grey-450)', lineHeight: '1.5' }}>
            <p>{treatmentData.description}</p>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto px-2 py-4">
          <button 
            className="w-full py-4 rounded-lg label1" 
            style={{ 
              background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)',
              color: 'var(--color-white)',
              fontWeight: 'var(--font-weight-semibold)'
            }}
            onClick={handleModalOpen}
          >
            예약하기
          </button>
        </div>
      </div>
      
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 transition-opacity z-50"
          onClick={handleModalClose}
        >
          <div 
            className="w-full max-w-xs p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: 'var(--color-grey-850)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <p className="body1" style={{ color: 'var(--color-white)', marginBottom: '16px' }}>
                더 깊이 있는 경험을 위해서는<br/>계정이 필요해요
              </p>
              <p className="caption2" style={{ color: 'var(--color-grey-450)', marginBottom: '24px' }}>
                로그인하고 함께 예약을 관리해보세요
              </p>

              <button 
                className="w-full py-3 rounded-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#FEE500', marginBottom: '12px' }}
                onClick={handleKakaoLogin}
              >
                <img src="https://www.kakaocorp.com/page/assets/favicon/favicon-16x16.png" alt="카카오 로고" className="w-4 h-4" />
                <span className="label1" style={{ color: '#000000', fontWeight: 'var(--font-weight-semibold)' }}>
                  카카오 로그인
                </span>
              </button>
              
              <button 
                className="w-full body2" 
                style={{ color: 'var(--color-grey-450)' }}
                onClick={handleModalClose}
              >
                더 둘러볼게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtDetailPage;
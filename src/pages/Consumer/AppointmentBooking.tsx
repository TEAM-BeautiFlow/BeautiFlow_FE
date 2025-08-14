import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, X, Plus, ChevronRight } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';

import useBookingStore from '../../stores/bookingStore';

// AppointmentBookingPage 컴포넌트
const AppointmentBookingPage = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();

    // Zustand 스토어에서 예약 관련 상태와 함수를 가져옵니다.
    const {
        treatmentId,
        treatmentName,
        treatmentPrice,
        treatmentImageUrl,
        selectedOptions,
        date,
        time,
        designerId,
        referenceImages, // 이전 단계에서 추가한 이미지를 가져옵니다.
        resetBookingState,
    } = useBookingStore();

    // 컴포넌트 내부 상태
    const [description, setDescription] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'uploading' | 'processing'>('idle');

    // API 관련 상수
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzNDg4NDIwMjEiLCJ1c2VySWQiOjU4LCJpYXQiOjE3NTQ5Njk5MDAsImV4cCI6MTc1NzU2MTkwMH0.BzWPMm9rWf7IlmRSeO7xFySG6lic0NuQha2dDWt8yzY";

    // 이미지 파일 선택 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (imageFiles.length + files.length > 5) {
                alert('이미지는 최대 5개까지 첨부할 수 있습니다.');
                return;
            }
            setImageFiles(prev => [...prev, ...files]);
        }
    };

    // 선택된 이미지 제거 핸들러
    const removeImage = (indexToRemove: number) => {
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // 단일 이미지 업로드 함수
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        // 서버 응답 구조에 따라 URL 반환 경로를 조정해야 할 수 있습니다.
        return response.data.url || response.data.data?.url || response.data;
    };

    // 예약 처리 메인 함수
    const handleProcessReservation = async () => {
        if (!shopId || !treatmentId || !date || !time || !designerId) {
            alert('예약 정보가 불완전합니다. 이전 단계로 돌아가 다시 시도해주세요.');
            return;
        }

        setIsSubmitting(true);
        let finalImageUrls = [...(referenceImages || [])]; // 이전 단계의 이미지와 합침

        try {
            // 1. 새로 추가된 이미지가 있으면 서버에 업로드
            if (imageFiles.length > 0) {
                setSubmitStatus('uploading');
                const uploadPromises = imageFiles.map(file => uploadImage(file));
                const uploadedUrls = await Promise.all(uploadPromises);
                finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            }

            // 2. 예약 처리 API 요청
            setSubmitStatus('processing');
            const requestBody = {
                deleteTempReservation: true,
                tempSaveData: false,
                treatmentId,
                selectedOptions,
                dateTimeDesignerData: { date, time, designerId },
                requestNotesAndStyleData: {
                    requestNotes: description,
                    styleImageUrls: finalImageUrls, // 업로드된 이미지 URL 배열
                },
                saveFinalReservation: true,
            };
            
            const response = await axios.post(`${API_BASE_URL}/reservations/${shopId}/process`, requestBody, {
                headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
            });

            // 3. 성공 처리
            if (response.data.success) {
                alert('예약이 성공적으로 완료되었습니다!');
                resetBookingState(); // Zustand 스토어 상태 초기화
                navigate('/reservation'); // 예약 완료 페이지로 이동
            } else {
                // 서버에서 success: false 응답을 보냈을 경우
                throw new Error(response.data.message || '알 수 없는 오류가 발생했습니다.');
            }
        } catch (err) {
            // 4. 에러 처리
            let errorMessage = '예약 처리 중 오류가 발생했습니다.';
            if (axios.isAxiosError(err) && err.response) {
                // 서버에서 구체적인 에러 메시지를 보냈을 경우
                errorMessage = err.response.data.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        } finally {
            // 5. 로딩 상태 해제
            setIsSubmitting(false);
            setSubmitStatus('idle');
        }
    };

    // 버튼에 표시될 텍스트
    const getButtonText = () => {
        if (submitStatus === 'uploading') return '이미지 업로드 중...';
        if (submitStatus === 'processing') return '예약 처리 중...';
        return '다음으로';
    };

    return (
        <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                <ChevronLeft size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
                <h1 className="title1">시술 예약하기</h1>
                <X size={24} className="cursor-pointer" onClick={() => navigate('/')} />
            </div>

            {/* 시술 정보 섹션 */}
            <div style={{ padding: '0 20px 32px' }}>
                <h2 className="label1" style={{ marginBottom: '16px' }}>시술 정보</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '101px', height: '101px', borderRadius: '8px', flexShrink: 0, backgroundImage: `url(${treatmentImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--color-grey-350)' }}>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="label1 font-semibold">{treatmentName || '시술 정보 로딩 중...'}</div>
                        <div className="label1 font-semibold">{treatmentPrice?.toLocaleString() || '...'}원</div>
                    </div>
                    <ChevronRight size={20} color="var(--color-grey-450)" />
                </div>
            </div>

            {/* 요청사항 섹션 */}
            <div style={{ padding: '0 20px 32px' }}>
                <h2 className="label1" style={{ marginBottom: '8px' }}>요청사항</h2>
                <p className="body2" style={{ color: 'var(--color-grey-450)', marginBottom: '16px' }}>요청사항이나 레퍼런스를 공유해주세요. (optional)</p>

                {/* 이미지 첨부 */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {imageFiles.map((file, index) => (
                        <div key={index} style={{ width: '80px', height: '80px', borderRadius: '8px', position: 'relative', flexShrink: 0 }}>
                            <img src={URL.createObjectURL(file)} alt={`preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                            <button onClick={() => removeImage(index)} style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={12} color="var(--color-white)" />
                            </button>
                        </div>
                    ))}
                    {imageFiles.length < 5 && (
                        <label style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-grey-850)', borderRadius: '8px', border: '1px solid var(--color-grey-750)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '4px', flexShrink: 0 }}>
                            <Plus size={20} color="var(--color-grey-450)" />
                            <span className="caption2" style={{ color: 'var(--color-grey-450)' }}>사진 {imageFiles.length}/5</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    )}
                </div>
                
                {/* 텍스트 입력 */}
                <div style={{ position: 'relative' }}>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="요청사항을 입력해주세요." maxLength={100}
                        style={{ width: '100%', height: '100px', backgroundColor: 'var(--color-grey-850)', border: '1px solid var(--color-grey-750)', borderRadius: '8px', padding: '16px', color: 'var(--color-white)', fontSize: '14px', fontFamily: 'inherit', resize: 'none', outline: 'none' }}/>
                    <span className="caption2" style={{ position: 'absolute', bottom: '12px', right: '16px', color: 'var(--color-grey-450)' }}>
                        {description.length}/100
                    </span>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div style={{ padding: '0 20px 40px' }}>
                <button onClick={handleProcessReservation} disabled={isSubmitting}
                    style={{ width: '100%', height: '56px', background: 'linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)', border: 'none', borderRadius: '8px', color: 'var(--color-white)', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {isSubmitting && <div style={{width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>}
                    {getButtonText()}
                </button>
            </div>
            {/* 스피너 애니메이션을 위한 CSS (전역 CSS나 style 태그에 추가) */}
            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default AppointmentBookingPage;
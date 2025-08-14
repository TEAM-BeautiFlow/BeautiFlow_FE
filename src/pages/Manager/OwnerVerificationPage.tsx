// OwnerVerificationPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, User, MessageSquare, Calendar, MoreHorizontal, ChevronRight, ShieldAlert, CheckCircle2, Pencil, Image, DollarSign, Clock } from 'lucide-react';
import '../../styles/color-system.css';
import '../../styles/type-system.css';

import type { ShopData, ApiResponse } from '../../types/api';

const OwnerVerificationPage = () => {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [businessLicenseStatus, setBusinessLicenseStatus] = useState<'미인증' | '확인중' | '인증완료'>('미인증');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    // name -> shopName으로 변경
    shopName: '',
    contact: '',
    address: '',
    introText: '',
  });

  const SHOP_ID = 1; 
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzNDg4NDIwMjEiLCJ1c2VySWQiOjU4LCJpYXQiOjE3NTQ5Njk5MDAsImV4cCI6MTc1NzU2MTkwMH0.BzWPMm9rWf7IlmRSeO7xFySG6lic0NuQha2dDWt8yzY";

  const fetchData = async () => {
    console.log("API 호출 시작...");
    try {
      setIsLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      };

      const shopApiUrl = `${API_BASE_URL}/shops/manage/${SHOP_ID}`;
      const licenseApiUrl = `${API_BASE_URL}/shops/manage/${SHOP_ID}/license-image`;

      console.log("매장 정보 API 요청 URL:", shopApiUrl);
      console.log("사업자등록증 API 요청 URL:", licenseApiUrl);

      const [shopResponse, licenseResponse] = await Promise.all([
        axios.get<ApiResponse<ShopData>>(`${API_BASE_URL}/shops/manage/${SHOP_ID}`, { headers }),
        axios.get<ApiResponse<string>>(`${API_BASE_URL}/shops/manage/${SHOP_ID}/license-image`, { headers })
      ]);
      
      console.log("매장 정보 API 응답:", shopResponse.data);
      console.log("사업자등록증 API 응답:", licenseResponse.data);
      

      if (shopResponse.data.success && shopResponse.data.data) {
        setShopData(shopResponse.data.data);
        setEditFormData({
          // 응답 데이터의 name -> shopName으로 변경
          shopName: shopResponse.data.data.shopName,
          contact: shopResponse.data.data.contact,
          address: shopResponse.data.data.address,
          introText: shopResponse.data.data.introText,
        });
        console.log("shopData 상태 업데이트 완료:", shopResponse.data.data);
      } else {
        setError(shopResponse.data.message || '매장 정보 로딩 실패');
      }

      if (licenseResponse.data.success) {
        if (licenseResponse.data.data) {
          setBusinessLicenseStatus('확인중');
        } else {
          setBusinessLicenseStatus('미인증');
        }
      }
    } catch (err) {
      console.error('API 호출 중 에러 발생:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || err.message);
        } else {
          setError(err.message);
        }
      } else {
        setError("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
      console.log("API 호출 종료. isLoading: false");
    }
  };

  useEffect(() => {
    console.log('컴포넌트 마운트됨, API 호출 시작');
    fetchData();
  }, []);

  const handleLicenseUpload = async (file: File) => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }
    const formData = new FormData();
    formData.append('licenseImage', file);
    try {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      };
      await axios.post(`${API_BASE_URL}/shops/manage/${SHOP_ID}/license-image`, formData, { headers });
      alert('사업자등록증이 성공적으로 등록되었습니다.');
      setBusinessLicenseStatus('확인중');
    } catch (err) {
      console.error('사업자등록증 등록 실패:', err);
      alert('사업자등록증 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      };
      // 매장 정보 수정 시에도 shopName을 사용하도록 변경
      await axios.patch(`${API_BASE_URL}/shops/manage/${SHOP_ID}`, editFormData, { headers });
      alert('매장 정보가 성공적으로 수정되었습니다.');
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('매장 정보 수정 실패:', err);
      alert('매장 정보 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !shopData) {
      console.log('에러 상태이거나 shopData가 null입니다. error:', error, 'shopData:', shopData);
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-red)' }}>
        <p>데이터 로딩에 실패했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ 
      backgroundColor: 'var(--color-black)',
      color: 'var(--color-white)',
      fontFamily: 'Pretendard, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', fontSize: '16px', fontWeight: '600' }}>
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

      <header className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: 'var(--color-black)' }}>
        <span className="h1" style={{ color: 'var(--color-purple)' }}>BEAUTIFLOW</span>
      </header>

      <div className="px-5 py-4 flex items-center space-x-3" style={{ backgroundColor: 'var(--color-black)' }}>
        <div className="w-14 h-14 rounded-full flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-grey-350)' }}>
          {shopData.mainImageUrl && <img src={shopData.mainImageUrl} alt="매장 프로필" className="object-cover w-full h-full" />}
          {!shopData.mainImageUrl && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '20px 20px' }}></div>}
        </div>
        <div className="flex-1">
          {/* name -> shopName으로 변경 */}
          <h2 className="title1" style={{ color: 'var(--color-white)' }}>{shopData.shopName}</h2>
          <p className="caption2" style={{ color: 'var(--color-grey-450)' }}>
            {shopData.introText || '-'}
          </p>
        </div>
      </div>

      <div className="px-5">
        <label htmlFor="license-file-input">
          <button 
            className="flex items-center justify-between w-full px-5 py-4 cursor-pointer"
            style={{
              backgroundColor: businessLicenseStatus !== '미인증' ? 'var(--color-grey-950)' : 'var(--color-status-dark-red)', 
              color: businessLicenseStatus !== '미인증' ? 'var(--color-light-purple)' : 'var(--color-status-red)',
              border: businessLicenseStatus !== '미인증' ? '1px solid var(--color-light-purple)' : 'none',
            }}
            disabled={businessLicenseStatus !== '미인증'}
            onClick={() => {
              if (businessLicenseStatus === '미인증') {
                document.getElementById('license-file-input')?.click();
              }
            }}
          >
            <div className="flex items-center gap-2">
              {businessLicenseStatus === '미인증' ? (
                <ShieldAlert size={20} style={{ color: 'var(--color-status-red)' }} />
              ) : (
                <CheckCircle2 size={20} style={{ color: 'var(--color-light-purple)' }} />
              )}
              <span className="label1">
                {businessLicenseStatus === '미인증' && '사업자등록증 인증 필요'}
                {businessLicenseStatus === '확인중' && '사업자등록증 확인 중'}
                {businessLicenseStatus === '인증완료' && '사업자등록증 인증 완료'}
              </span>
            </div>
            <ChevronRight size={20} style={{ color: businessLicenseStatus !== '미인증' ? 'var(--color-light-purple)' : 'var(--color-status-red)' }} />
          </button>
        </label>
        <input 
          id="license-file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleLicenseUpload(file);
            }
          }}
        />
      </div>

      <div className="flex border-b px-5" style={{ borderColor: 'var(--color-grey-850)', backgroundColor: 'var(--color-black)' }}>
        <button className="py-3 px-2 label1 border-b-2" style={{ borderColor: 'var(--color-light-purple)', color: 'var(--color-light-purple)', fontWeight: 'var(--font-weight-semibold)' }}>기본</button>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>시술</button>
        <button className="py-3 px-2 label1" style={{ color: 'var(--color-grey-450)', fontWeight: 'var(--font-weight-medium)' }}>공지사항</button>
      </div>

      <div className="px-5 py-4 flex-1 overflow-y-auto pb-20">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>매장 정보</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }} onClick={() => setIsEditModalOpen(true)}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home size={16} style={{ color: 'var(--color-grey-450)' }} />
              {/* name -> shopName으로 변경 */}
              <span className="body2" style={{ color: 'var(--color-white)' }}>{shopData.shopName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>{shopData.contact || '-'}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)', lineHeight: '1.5' }}>{shopData.address || '-'}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>매장 소개</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }} onClick={() => setIsEditModalOpen(true)}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Pencil size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>{shopData.introText || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>
                {shopData.mainImageUrl ? '대표 이미지 등록됨' : '-'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>매출 관리</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }} onClick={() => setIsEditModalOpen(true)}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>-</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>-</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="label1" style={{ color: 'var(--color-white)' }}>영업 시간</h3>
            <button className="caption2" style={{ color: 'var(--color-light-purple)' }} onClick={() => setIsEditModalOpen(true)}>수정</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>-</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: 'var(--color-grey-450)' }} />
              <span className="body2" style={{ color: 'var(--color-white)' }}>-</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto flex justify-around items-center py-3" style={{ backgroundColor: 'var(--color-black)', borderTop: '1px solid var(--color-grey-850)' }}>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <Calendar size={24} />예약</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <User size={24} />고객</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <MessageSquare size={24} />채팅</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-light-purple)' }}>
          <Home size={24} />매장</button>
        <button className="flex flex-col items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-grey-450)' }}>
          <MoreHorizontal size={24} />더보기</button>
      </nav>
      
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md" style={{ color: 'var(--color-white)' }}>
            <h3 className="title1 mb-4">매장 정보 수정</h3>
            <form onSubmit={handleEditSubmit}>
              <label className="block mb-2">매장 이름</label>
              <input
                type="text"
                name="shopName"
                // name -> shopName으로 변경
                value={editFormData.shopName}
                onChange={(e) => setEditFormData({ ...editFormData, shopName: e.target.value })}
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                placeholder="매장 이름"
              />
              <label className="block mb-2">연락처</label>
              <input
                type="text"
                name="contact"
                value={editFormData.contact}
                onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                placeholder="연락처"
              />
              <label className="block mb-2">주소</label>
              <input
                type="text"
                name="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                placeholder="주소"
              />
              <label className="block mb-2">매장 소개</label>
              <textarea
                name="introText"
                value={editFormData.introText}
                onChange={(e) => setEditFormData({ ...editFormData, introText: e.target.value })}
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                rows={4}
                placeholder="매장 소개"
              ></textarea>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 rounded text-white"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerVerificationPage;
import React from 'react';
import { ChevronLeft, Clock } from 'lucide-react';

const ArtDetailPage = () => {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-black text-white text-sm font-medium">
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
      <div className="bg-black px-4 py-3">
        <ChevronLeft className="w-6 h-6 text-white" />
      </div>

      {/* Image Placeholder */}
      <div className="relative h-96 bg-gray-100">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-black text-white px-6 py-6 flex-1">
        <h1 className="text-xl font-medium mb-4">이달의 아트</h1>
        
        <div className="text-lg mb-6">
          <span className="font-medium">34,000원</span>
          <span className="text-gray-400 mx-2">~</span>
          <span className="font-medium">47,000원</span>
        </div>

        <div className="flex items-center mb-6">
          <div className="bg-gray-700 rounded-full px-3 py-1 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300">소요시간 | 60분</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-medium mb-4 border-b border-gray-600 pb-2">시술 정보</h2>
          
          <div className="space-y-4 text-sm leading-relaxed text-gray-300">
            <p>
              9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어
              주세요! 9월 이달의 아트입니다. 9월 이달의 아트입니다. 9월
              이달의 아트입니다.
            </p>
            
            <p>
              9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어
              주세요! 9월 이달의 아트입니다. 9월 이달의 아트입니다. 9월
              이달의 아트입니다.
            </p>
            
            <p>
              9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어
              주세요! 9월 이달의 아트입니다. 9월 이달의 아트입니다. 9월
              이달의 아트입니다.
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className= "w-full max-w-sm px-2">
          <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg text-base font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
            시술 담기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtDetailPage;
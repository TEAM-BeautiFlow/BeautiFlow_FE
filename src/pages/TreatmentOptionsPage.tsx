import React, { useState } from 'react';
import { ChevronLeft, Clock, Check } from 'lucide-react';
import { fingerOptions, toeOptions, managementOptions } from '../data/options';
import type {Option} from '../data/options';

const TreatmentOptionsPage = () => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionSelect = (category: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: optionId
    }));
  };

  const renderOptionGroup = (title: string, options: Option[], category: string) => (
    <div className="mb-8">
      <h3 className="text-white text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedOptions[category] === option.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-600 bg-gray-800/50'
            }`}
            onClick={() => handleOptionSelect(category, option.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-base font-medium">{option.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm">{option.price}</span>
                    {selectedOptions[category] === option.id && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-black min-h-screen">
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
      <div className="bg-black px-4 py-4 flex items-center space-x-4">
        <ChevronLeft className="w-6 h-6 text-white" />
        <h1 className="text-white text-lg font-medium">시술 옵션 선택</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Treatment Info */}
        <div className="mb-8">
          <h2 className="text-white text-xl font-medium mb-4">시술 정보</h2>
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
              <div className="w-full h-full opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 20l20-20h-20zm20 0v-20h-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">소요시간 | 60분</span>
              </div>
              <div className="text-white">
                <span className="text-lg font-medium">34,000원</span>
                <span className="text-gray-400 mx-2">~</span>
                <span className="text-lg font-medium">47,000원</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                9월 이달의 아트입니다. 믹스 조합을 원하시면 요청사항에 적어주세요! 9월 이달의 아트입니다...
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mb-32">
          <h2 className="text-white text-xl font-medium mb-6">옵션 선택</h2>
          {renderOptionGroup('손', fingerOptions, 'finger')}
          {renderOptionGroup('발가락', toeOptions, 'toe')}
          {renderOptionGroup('관리', managementOptions, 'management')}
        </div>

        {/* Bottom Button */}
        <div className="w-full max-w-sm px-2">
          <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg text-base font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
            시술 담기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentOptionsPage;
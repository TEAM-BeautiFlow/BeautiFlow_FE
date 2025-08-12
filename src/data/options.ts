// data/options.ts
export interface Option {
  id: string;
  name: string;
  price: string;
  description: string;
  time?: string; // 새로운 time 속성 추가 (선택적)
}

export const fingerOptions: Option[] = [
  {
    id: 'basic',
    name: '없음',
    price: '0원',
    description: '젤 제거를 하지 않는 경우'
  },
  {
    id: 'care',
    name: '자샵',
    price: '10,000원',
    description: '젤 제거 (자샵)',
    time: '30분' // 시간 정보 별도 필드로 분리
  },
  {
    id: 'premium',
    name: '타샵',
    price: '10,000원',
    description: '젤 제거 (타샵)',
    time: '30분' // 시간 정보 별도 필드로 분리
  }
];

export const toeOptions: Option[] = [
  {
    id: 'basic-toe',
    name: '없음',
    price: '0원',
    description: '젤 연장을 하지 않는 경우'
  },
  {
    id: 'simple-toe',
    name: '1-5개',
    price: '10,000원',
    description: '젤 연장 (1-5개)',
    time: '30분' // 시간 정보 별도 필드로 분리
  },
  {
    id: 'care-toe',
    name: '6-10개',
    price: '20,000원',
    description: '젤 연장 (6-10개)',
    time: '60분' // 시간 정보 별도 필드로 분리
  }
];

export const managementOptions: Option[] = [
  {
    id: 'basic-mgmt',
    name: '없음',
    price: '0원',
    description: '랩핑을 하지 않는 경우'
  },
  {
    id: 'special-mgmt',
    name: '떨어진 손톱 보수',
    price: '10,000원',
    description: '떨어진 손톱 보수 (1개당)',
    time: '30분' // 시간 정보 별도 필드로 분리
  }
];

// 추가 옵션 카테고리 예시 (기존 데이터 유지)
export const additionalOptions: Option[] = [
  {
    id: 'art-basic',
    name: '아트 기본',
    price: '사진 +2,000원',
    description: '심플 아트 디자인'
  },
  {
    id: 'art-premium',
    name: '아트 프리미엄',
    price: '사진 +7,000원',
    description: '복잡한 아트 디자인'
  },
  {
    id: 'glitter',
    name: '글리터',
    price: '사진 +1,500원',
    description: '반짝이는 글리터 효과'
  },
  {
    id: 'french',
    name: '프렌치',
    price: '사진 +4,000원',
    description: '클래식 프렌치 디자인'
  }
];

export const optionCategories = {
  finger: fingerOptions,
  toe: toeOptions,
  management: managementOptions,
  additional: additionalOptions
} as const;

export const categoryNames = {
  finger: '손 세가',
  toe: '발가락',
  management: '관리',
  additional: '추가 옵션'
} as const;

export const findOptionById = (optionId: string): Option | undefined => {
  const allOptions = [
    ...fingerOptions,
    ...toeOptions,
    ...managementOptions,
    ...additionalOptions
  ];
  return allOptions.find(option => option.id === optionId);
};

export const calculateTotalPrice = (selectedOptions: Record<string, string>): number => {
  let total = 34000; // 기본 가격 (예시)
  
  Object.values(selectedOptions).forEach(optionId => {
    const option = findOptionById(optionId);
    if (option && option.price.includes('+')) {
      const priceMatch = option.price.match(/\+(\d+,?\d*)/);
      if (priceMatch) {
        const additionalPrice = parseInt(priceMatch[1].replace(',', ''));
        total += additionalPrice;
      }
    } else if (option && !isNaN(parseInt(option.price.replace(',', '')))) {
      // '+'가 없는 순수 가격도 더하도록 수정
      total += parseInt(option.price.replace(',', ''));
    }
  });
  
  return total;
};

# ✨ BeautiFlow: Front-end Repository

### 💡 운영에 집중할 수 있는 뷰티샵 전용 예약·고객 관리 솔루션, BeautiFlow

BeautiFlow는 소규모 뷰티샵 사장님들의 예약 및 고객 관리 업무를 자동화하고, 시술 이력 관리, 리터치 알림 등 뷰티업에 특화된 기능을 제공하여 운영 효율을 높이고 고객 재방문율을 향상시키는 것을 목표로 하는 SaaS 솔루션입니다.

본 레포지토리는 BeautiFlow 서비스의 프론트엔드 코드베이스를 관리합니다.

<br>

## 🎯 주요 기능

BeautiFlow는 사장님과 고객, 두 가지 사용자 관점을 모두 고려하여 설계되었습니다.

#### 🙋🏻‍♀️ 고객용 화면 (Client View)

-   **시술 및 샵 탐색:** 원하는 지역과 시술을 기반으로 뷰티샵을 탐색하고 예약합니다.
-   **간편 예약:** 원하는 날짜와 시간을 선택하여 간편하게 예약 및 결제를 진행합니다.
-   **마이페이지:** 자신의 예약 내역, 시술 이력, 리터치 일정 등을 한눈에 확인합니다.

#### 👩‍💼 사장님용 화면 (Admin View)

-   **예약 관리 대시보드:** 일별, 주별, 월별 예약 현황을 캘린더 형태로 확인하고 관리합니다.
-   **고객 관리:** 고객별 상세 정보, 시술 기록(사진, 메모 포함), 특이사항 등을 체계적으로 관리합니다.
-   **자동 리터치 알림:** 고객의 마지막 시술일 기준, 적절한 시점에 리터치 예약 알림을 자동으로 발송합니다.
-   **스케줄 관리:** 직원별 근무 시간과 담당 시술을 유연하게 설정하고 관리합니다.
-   **마케팅 메시지 발송:** 단골 고객 또는 특정 고객 그룹에게 프로모션 및 이벤트 메시지를 손쉽게 발송합니다.

<br>

## 🛠 기술 스택 (Tech Stack)

* **Framework**: React
* **Language**: TypeScript
* **State Management**: Zustand
* **Styling**: Tailwind CSS
* **Data Fetching**: React-Query
* **HTTP Client**: Axios
* **Linting & Formatting**: ESLint & Prettier

*(위 스택은 프로젝트 진행 상황에 따라 변경될 수 있습니다.)*

<br>

## 🚀 프로젝트 시작하기

```bash
# 1. 레포지토리를 클론합니다.
$ git clone [https://github.com/your-organization/beautiflow-frontend.git](https://github.com/your-organization/beautiflow-frontend.git)

# 2. 프로젝트 폴더로 이동합니다.
$ cd beautiflow-frontend

# 3. 의존성 패키지를 설치합니다.
$ npm install
# or
$ yarn install

# 4. 개발 서버를 실행합니다.
$ npm run dev
# or
$ yarn dev
```
## 📁 폴더 구조
```
src
├── apis/         # API 요청 함수 모음
├── assets/       # 이미지, 폰트 등 정적 파일
├── components/   # 재사용 가능한 UI 컴포넌트
├── constants/    # 상수 관리
├── hooks/        # 커스텀 훅
├── layout/       # 공통 레이아웃 컴포넌트
├── pages/        # 페이지 모음
├── store/        # 전역 상태 관리 (Zustand)
├── styles/       # 전역 스타일 및 테마
└── types/        # 타입 정의
```

<br>

## 🤝 약속 및 가이드라인

원활한 협업과 코드 품질 유지를 위해 다음 가이드라인을 준수합니다.

#### Git Convention

-   **Branch:** `feature/{기능명}`, `fix/{버그내용}` 등 브랜치 목적에 맞는 네이밍을 사용합니다.
-   **Commit Message:** [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 규칙을 따릅니다.
    -   `feat`: 새로운 기능 추가
    -   `fix`: 버그 수정
    -   `docs`: 문서 수정
    -   `style`: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없는 경우)
    -   `refactor`: 코드 리팩토링
    -   `test`: 테스트 코드 추가/수정
#### Code Style

-   프로젝트에 설정된 **ESLint**와 **Prettier** 규칙을 따릅니다.
-   `commit` 전 `lint`와 `format` 스크립트를 실행하여 코드 스타일을 통일합니다.
-   궁금한 점이나 막히는 부분은 혼자 고민하지 말고 언제든지 편하게 팀원들과 소통해주세요! 🫶🏻
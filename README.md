# 🌿 작은 잎새 상점

> 손님의 마음에 어울리는 식물을 골라주는 캐주얼 힐링 게임

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

## 소개

작은 잎새 상점은 매일 찾아오는 손님의 고민과 감정을 듣고, 그에 어울리는 식물을 추천해주는 힐링 게임입니다.

손님을 잘 만족시키면 감사 편지를 받고 새로운 식물과 소품을 얻을 수 있어요.

## 주요 기능

- **손님 응대** — 손님의 니즈를 파악하고 최적의 식물을 추천
- **식물 도감** — 다양한 식물 정보 열람 및 코인으로 구매
- **식물 탐험** — 탐험대를 보내 희귀 식물 발견
- **씨앗 정원** — 씨앗을 받아 매일 물을 주며 키우기
- **가게 꾸미기** — 소품을 배치해 나만의 가게 인테리어
- **소품 상점** — 코인으로 새로운 소품 구매
- **편지함** — 만족한 손님들이 보내온 감사 편지 보관

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 기술 스택

- **React 18** — UI 라이브러리
- **Vite 5** — 빌드 도구
- **Context API + useReducer** — 상태 관리
- **CSS (vanilla)** — 스타일링
- **localStorage** — 게임 저장

## 게임 구조

```
src/
├── context/
│   └── GameContext.jsx   # 전역 상태 및 게임 로직
├── data/
│   ├── plants.js          # 식물 데이터 및 매칭 알고리즘
│   ├── customers.js       # 손님 생성 로직
│   ├── decorations.js     # 소품 데이터 및 그리드
│   └── expeditions.js     # 탐험 데이터 및 씨앗 성장
└── screens/
    ├── TitleScreen          # 타이틀
    ├── MainShop             # 메인 가게 화면
    ├── CustomerScreen       # 손님 응대
    ├── PlantSelectionScreen # 식물 추천
    ├── ResultScreen         # 결과 화면
    ├── PlantEncyclopediaScreen # 식물 도감
    ├── PlantDiscoveryScreen # 식물 탐험 & 씨앗 정원
    ├── ShopDecorateScreen   # 가게 꾸미기
    └── StorageScreen        # 보관함 (편지 & 소품)
```

## 라이선스

MIT

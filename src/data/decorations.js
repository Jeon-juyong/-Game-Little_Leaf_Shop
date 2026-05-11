export const DECORATIONS = [
  { id: 'rug-green', name: '초록 러그', emoji: '🟩', type: 'floor', description: '부드러운 초록색 러그', unlocked: true, price: 0 },
  { id: 'rug-round', name: '동그란 러그', emoji: '⭕', type: 'floor', description: '아기자기한 원형 러그', unlocked: true, price: 0 },
  { id: 'frame-nature', name: '자연 액자', emoji: '🖼️', type: 'wall', description: '자연 풍경 벽걸이 액자', unlocked: true, price: 0 },
  { id: 'lamp-warm', name: '따뜻한 조명', emoji: '🪔', type: 'shelf', description: '아늑한 분위기의 작은 조명', unlocked: true, price: 0 },
  { id: 'watering-can', name: '물뿌리개', emoji: '🚿', type: 'counter', description: '예쁜 구리색 물뿌리개', unlocked: true, price: 0 },
  { id: 'basket-wicker', name: '라탄 바구니', emoji: '🧺', type: 'floor', description: '자연스러운 라탄 바구니', unlocked: true, price: 0 },
  { id: 'candle', name: '향초', emoji: '🕯️', type: 'shelf', description: '은은한 향초', unlocked: false, price: 30 },
  { id: 'frame-cat', name: '고양이 액자', emoji: '🐱', type: 'wall', description: '귀여운 고양이 일러스트 액자', unlocked: false, price: 40 },
  { id: 'teapot', name: '찻주전자', emoji: '🫖', type: 'counter', description: '도자기 찻주전자 세트', unlocked: false, price: 45 },
  { id: 'wind-chime', name: '풍경', emoji: '🎐', type: 'wall', description: '맑은 소리의 작은 풍경', unlocked: false, price: 55 },
  { id: 'lantern', name: '랜턴', emoji: '🏮', type: 'shelf', description: '따뜻한 빛의 작은 랜턴', unlocked: false, price: 50 },
  { id: 'mushroom', name: '버섯 장식', emoji: '🍄', type: 'shelf', description: '귀여운 버섯 미니어처', unlocked: false, price: 35 },
  { id: 'crystal', name: '크리스탈', emoji: '💎', type: 'shelf', description: '빛을 반사하는 크리스탈 소품', unlocked: false, price: 80 },
  { id: 'fairy-lights', name: '페어리 라이트', emoji: '✨', type: 'wall', description: '반짝이는 미니 전구 조명', unlocked: false, price: 70 },
  { id: 'clock', name: '벽시계', emoji: '🕐', type: 'wall', description: '빈티지풍 벽시계', unlocked: false, price: 90 },
];

export const SHOP_GRID = {
  cols: 4,
  rows: 3,
  zones: [
    { id: 'shelf-tl', label: '선반 (위)', zone: 'shelf', x: 0, y: 0, allowTypes: ['shelf', 'wall'] },
    { id: 'shelf-tr', label: '선반 (위)', zone: 'shelf', x: 1, y: 0, allowTypes: ['shelf', 'wall'] },
    { id: 'window', label: '창가', zone: 'window', x: 2, y: 0, allowTypes: ['wall', 'shelf'], fixed: true, fixedEmoji: '🪟' },
    { id: 'wall-r', label: '벽', zone: 'wall', x: 3, y: 0, allowTypes: ['wall'] },
    { id: 'shelf-bl', label: '선반 (아래)', zone: 'shelf', x: 0, y: 1, allowTypes: ['shelf'] },
    { id: 'counter', label: '카운터', zone: 'counter', x: 1, y: 1, allowTypes: ['counter'], fixed: true, fixedEmoji: '🏪' },
    { id: 'counter-r', label: '카운터 옆', zone: 'counter', x: 2, y: 1, allowTypes: ['counter', 'shelf'] },
    { id: 'floor-r', label: '바닥 (오른쪽)', zone: 'floor', x: 3, y: 1, allowTypes: ['floor'] },
    { id: 'floor-tl', label: '바닥 (왼쪽)', zone: 'floor', x: 0, y: 2, allowTypes: ['floor'] },
    { id: 'floor-ml', label: '바닥 (가운데)', zone: 'floor', x: 1, y: 2, allowTypes: ['floor'] },
    { id: 'floor-mr', label: '바닥 (가운데)', zone: 'floor', x: 2, y: 2, allowTypes: ['floor'] },
    { id: 'floor-br', label: '바닥 (오른쪽)', zone: 'floor', x: 3, y: 2, allowTypes: ['floor'] },
  ],
};

export function getDecorationById(id) {
  return DECORATIONS.find(d => d.id === id);
}

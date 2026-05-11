export const EXPEDITIONS = [
  {
    id: 'alley',
    name: '골목 탐색',
    emoji: '🏘️',
    bgGradient: 'linear-gradient(135deg, #F9FBE7 0%, #F1F8E9 100%)',
    tagBg: '#E8F5E9',
    tagText: '#2E7D32',
    borderColor: '#C8E6C9',
    description: '가게 근처 골목을 살살 돌아다니며 버려진 화분이나 담벼락 사이에서 자라는 식물을 찾아요.',
    cost: 20,
    targetRarity: 'common',
    rarityLabel: '일반 식물',
    searchMsg: '골목 구석구석을 살펴보는 중이에요...',
    foundMsg: '골목 한 켠에서 귀여운 식물을 발견했어요!',
    searchEmoji: '🏘️',
  },
  {
    id: 'trail',
    name: '숲길 탐험',
    emoji: '🌲',
    bgGradient: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%)',
    tagBg: '#FFF8E1',
    tagText: '#F57F17',
    borderColor: '#FFE082',
    description: '근처 산책로와 숲길을 따라 탐험해요. 보기 드문 야생 식물이 숨어있을지도 몰라요.',
    cost: 50,
    targetRarity: 'uncommon',
    rarityLabel: '희귀 식물',
    searchMsg: '울창한 숲속을 조심스럽게 탐험하는 중이에요...',
    foundMsg: '숲속 깊은 곳에서 보기 드문 식물을 발견했어요!',
    searchEmoji: '🌲',
  },
  {
    id: 'mountain',
    name: '깊은 산 채집',
    emoji: '🏔️',
    bgGradient: 'linear-gradient(135deg, #E8EAF6 0%, #E3F2FD 100%)',
    tagBg: '#F3E5F5',
    tagText: '#6A1B9A',
    borderColor: '#CE93D8',
    description: '험한 산속을 탐험해 전설로만 전해지는 희귀 식물을 채집해요. 위험하지만 그만한 가치가 있어요!',
    cost: 80,
    targetRarity: 'rare',
    rarityLabel: '전설 식물',
    searchMsg: '깊은 산속을 조심조심 오르는 중이에요...',
    foundMsg: '산 정상 가까이에서 전설의 식물을 발견했어요!',
    searchEmoji: '🏔️',
  },
];

export const SEED_STAGE_INFO = [
  { emoji: '🌰', label: '씨앗' },
  { emoji: '🌱', label: '새싹' },
  { emoji: '🌿', label: '자라는 중' },
  { emoji: '🌸', label: '완성!' },
];

export function getSeedStage(seed) {
  return Math.min(3, seed.wateredDays.length);
}

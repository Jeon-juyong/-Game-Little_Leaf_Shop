import { createContext, useContext, useReducer, useEffect } from 'react';
import { PLANTS, calcMatchScore } from '../data/plants';
import { generateDailyCustomers } from '../data/customers';
import { DECORATIONS } from '../data/decorations';
import { EXPEDITIONS } from '../data/expeditions';

const SAVE_KEY = 'little_leaf_shop_save';

function buildInitialState() {
  return {
    screen: 'title',
    day: 1,
    coins: 150,
    acquiredPlantIds: ['monstera', 'peace-lily', 'sansevieria', 'succulent', 'lucky-bamboo'],
    unlockedPlantIds: ['monstera', 'peace-lily', 'sansevieria', 'succulent', 'lucky-bamboo', 'ivy'],
    shopDecorations: [
      { zoneId: 'shelf-tl', decorationId: 'lamp-warm' },
      { zoneId: 'floor-tl', decorationId: 'rug-green' },
    ],
    unlockedDecorationIds: ['rug-green', 'rug-round', 'frame-nature', 'lamp-warm', 'watering-can', 'basket-wicker'],
    todaysCustomers: [],
    servedCount: 0,
    letters: [],
    seeds: [],
    expeditionResult: null,
    toast: null,
  };
}

function createSaveData(state) {
  return {
    day: state.day,
    coins: state.coins,
    acquiredPlantIds: state.acquiredPlantIds,
    unlockedPlantIds: state.unlockedPlantIds,
    shopDecorations: state.shopDecorations,
    unlockedDecorationIds: state.unlockedDecorationIds,
    letters: state.letters,
    seeds: state.seeds,
  };
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_NEW_GAME': {
      const customers = generateDailyCustomers(1);
      return { ...buildInitialState(), todaysCustomers: customers, screen: 'main' };
    }

    case 'LOAD_GAME': {
      const save = action.payload;
      const customers = generateDailyCustomers(save.day);
      return {
        ...buildInitialState(),
        ...save,
        seeds: save.seeds || [],
        todaysCustomers: customers,
        screen: 'main',
      };
    }

    case 'GO_SCREEN':
      return { ...state, screen: action.payload, toast: null };

    case 'RECOMMEND_PLANT': {
      const { customerId, plantId } = action.payload;
      const customer = state.todaysCustomers.find(c => c.id === customerId);
      const plant = PLANTS.find(p => p.id === plantId);
      if (!customer || !plant) return state;

      const score = calcMatchScore(customer.needs, plant.moodKeywords);
      const level = score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';
      const coins = level === 'high' ? 5 : level === 'medium' ? 3 : 1;

      const updatedCustomers = state.todaysCustomers.map(c =>
        c.id === customerId ? { ...c, served: true, plantId, score, level } : c
      );

      // Letter for high satisfaction
      let newLetter = null;
      if (level === 'high') {
        newLetter = {
          id: `${customerId}-${state.day}`,
          from: customer.name,
          avatar: customer.avatar,
          avatarBg: customer.avatarBg,
          text: customer.letter,
          day: state.day,
          read: false,
          date: `${state.day}일차`,
        };
      }

      // Unlock plant hint in encyclopedia
      let newUnlocked = [...state.unlockedPlantIds];
      let newUnlockedDeco = [...state.unlockedDecorationIds];
      let unlockMsg = null;

      if (level === 'high') {
        const locked = PLANTS.filter(p => !state.unlockedPlantIds.includes(p.id));
        if (locked.length > 0) {
          const found = pickRandom(locked);
          newUnlocked = [...newUnlocked, found.id];
          unlockMsg = `도감에 새 식물 등재: ${found.name} ${found.emoji}`;
        } else {
          const lockedDeco = DECORATIONS.filter(d => !state.unlockedDecorationIds.includes(d.id));
          if (lockedDeco.length > 0) {
            const found = pickRandom(lockedDeco);
            newUnlockedDeco = [...newUnlockedDeco, found.id];
            unlockMsg = `새 소품 획득: ${found.name} ${found.emoji}`;
          }
        }
      }

      // Seed gift: 40% chance on high, 10% on medium
      let newSeeds = [...state.seeds];
      let seedGift = null;
      const seedChance = level === 'high' ? 0.4 : level === 'medium' ? 0.1 : 0;
      if (Math.random() < seedChance) {
        const eligible = PLANTS.filter(
          p => !state.acquiredPlantIds.includes(p.id) &&
               !state.seeds.some(s => s.plantId === p.id)
        );
        if (eligible.length > 0) {
          const seedPlant = pickRandom(eligible);
          const newSeed = {
            id: `seed-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            plantId: seedPlant.id,
            plantedDay: state.day,
            wateredDays: [],
          };
          newSeeds = [...newSeeds, newSeed];
          seedGift = { plant: seedPlant };
        }
      }

      return {
        ...state,
        screen: 'result',
        todaysCustomers: updatedCustomers,
        servedCount: state.servedCount + 1,
        coins: state.coins + coins,
        unlockedPlantIds: newUnlocked,
        unlockedDecorationIds: newUnlockedDeco,
        letters: newLetter ? [newLetter, ...state.letters] : state.letters,
        seeds: newSeeds,
        pendingResult: {
          customer,
          plant,
          score,
          level,
          coins,
          unlockMsg,
          seedGift,
          message: customer.satisfactionMessages[level],
        },
      };
    }

    case 'NEXT_DAY': {
      const nextDay = state.day + 1;
      const customers = generateDailyCustomers(nextDay);
      return {
        ...state,
        day: nextDay,
        todaysCustomers: customers,
        servedCount: 0,
        screen: 'main',
        pendingResult: null,
        toast: `Day ${nextDay} 시작! 씨앗에 물도 잊지 마세요 🌿`,
      };
    }

    case 'CLEAR_TOAST':
      return { ...state, toast: null };

    case 'PLACE_DECORATION': {
      const { zoneId, decorationId } = action.payload;
      const filtered = state.shopDecorations.filter(d => d.zoneId !== zoneId);
      return {
        ...state,
        shopDecorations: decorationId
          ? [...filtered, { zoneId, decorationId }]
          : filtered,
      };
    }

    case 'BUY_PLANT': {
      const { plantId } = action.payload;
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant || state.coins < plant.basePrice || state.acquiredPlantIds.includes(plantId)) {
        return state;
      }
      return {
        ...state,
        coins: state.coins - plant.basePrice,
        acquiredPlantIds: [...state.acquiredPlantIds, plantId],
        toast: `${plant.name} ${plant.emoji}를 구매했어요!`,
      };
    }

    case 'BUY_DECORATION': {
      const { decoId } = action.payload;
      const deco = DECORATIONS.find(d => d.id === decoId);
      if (!deco || state.coins < deco.price || state.unlockedDecorationIds.includes(decoId)) {
        return state;
      }
      return {
        ...state,
        coins: state.coins - deco.price,
        unlockedDecorationIds: [...state.unlockedDecorationIds, decoId],
        toast: `${deco.name} ${deco.emoji}를 구매했어요!`,
      };
    }

    case 'MARK_LETTER_READ':
      return {
        ...state,
        letters: state.letters.map(l =>
          l.id === action.payload ? { ...l, read: true } : l
        ),
      };

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };

    // ─── 탐험 시스템 ───────────────────────────────────────────
    case 'START_EXPEDITION': {
      const { expeditionId } = action.payload;
      const expedition = EXPEDITIONS.find(e => e.id === expeditionId);
      if (!expedition || state.coins < expedition.cost) return state;

      const eligible = PLANTS.filter(
        p => p.rarity === expedition.targetRarity &&
             !state.acquiredPlantIds.includes(p.id)
      );

      if (eligible.length === 0) {
        // 보상 코인 지급 후 종료
        return {
          ...state,
          coins: state.coins - expedition.cost + Math.round(expedition.cost * 0.6),
          expeditionResult: null,
          toast: '이미 이 종류는 모두 보유 중이에요! 코인으로 보상을 받았어요 🪙',
        };
      }

      const found = pickRandom(eligible);
      return {
        ...state,
        coins: state.coins - expedition.cost,
        expeditionResult: { plant: found, expedition },
      };
    }

    case 'CLAIM_DISCOVERY': {
      const { plantId } = action.payload;
      const plant = PLANTS.find(p => p.id === plantId);
      return {
        ...state,
        acquiredPlantIds: [...new Set([...state.acquiredPlantIds, plantId])],
        unlockedPlantIds: [...new Set([...state.unlockedPlantIds, plantId])],
        expeditionResult: null,
        toast: `${plant?.name} ${plant?.emoji}을 가게로 데려왔어요!`,
      };
    }

    // ─── 씨앗 시스템 ───────────────────────────────────────────
    case 'WATER_SEED': {
      const { seedId } = action.payload;
      return {
        ...state,
        seeds: state.seeds.map(s =>
          s.id === seedId && !s.wateredDays.includes(state.day)
            ? { ...s, wateredDays: [...s.wateredDays, state.day] }
            : s
        ),
        toast: '씨앗에 물을 주었어요 💧',
      };
    }

    case 'HARVEST_SEED': {
      const { seedId } = action.payload;
      const seed = state.seeds.find(s => s.id === seedId);
      if (!seed) return state;
      const plant = PLANTS.find(p => p.id === seed.plantId);
      return {
        ...state,
        seeds: state.seeds.filter(s => s.id !== seedId),
        acquiredPlantIds: [...new Set([...state.acquiredPlantIds, seed.plantId])],
        unlockedPlantIds: [...new Set([...state.unlockedPlantIds, seed.plantId])],
        toast: `${plant?.name} ${plant?.emoji}이 완전히 자랐어요! 가게로 가져왔어요 🌿`,
      };
    }

    // 탐험에서 씨앗 직접 획득
    case 'ADD_SEED': {
      const { plantId } = action.payload;
      const already = state.seeds.some(s => s.plantId === plantId);
      const acquired = state.acquiredPlantIds.includes(plantId);
      if (already || acquired) return state;
      const plant = PLANTS.find(p => p.id === plantId);
      const newSeed = {
        id: `seed-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        plantId,
        plantedDay: state.day,
        wateredDays: [],
      };
      return {
        ...state,
        seeds: [...state.seeds, newSeed],
        toast: `${plant?.name} 씨앗을 심었어요! 🌰`,
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, buildInitialState());

  useEffect(() => {
    if (state.screen !== 'title') {
      localStorage.setItem(SAVE_KEY, JSON.stringify(createSaveData(state)));
    }
  }, [state]);

  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2800);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  function hasSave() { return !!localStorage.getItem(SAVE_KEY); }
  function getSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)); }
    catch { return null; }
  }

  return (
    <GameContext.Provider value={{ state, dispatch, hasSave, getSave }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}

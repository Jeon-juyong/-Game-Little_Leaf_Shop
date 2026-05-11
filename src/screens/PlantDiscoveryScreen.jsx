import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PLANTS, RARITY_LABEL, RARITY_COLOR } from '../data/plants';
import { EXPEDITIONS, SEED_STAGE_INFO, getSeedStage } from '../data/expeditions';
import './PlantDiscoveryScreen.css';

/* ─── 씨앗 화분 카드 ────────────────────────────────────── */
function SeedPot({ seed, currentDay, onWater, onHarvest }) {
  const stage = getSeedStage(seed);
  const plant = PLANTS.find(p => p.id === seed.plantId);
  const stageInfo = SEED_STAGE_INFO[stage];
  const wateredToday = seed.wateredDays.includes(currentDay);
  const isReady = stage >= 3;

  return (
    <div className={`seed-pot ${isReady ? 'seed-ready' : ''}`}>
      <div className="seed-pot-emoji-wrap" style={{ background: isReady ? plant?.bgColor : '#F5EDE0' }}>
        <span className="seed-stage-emoji">
          {isReady ? (plant?.emoji || '🌸') : stageInfo.emoji}
        </span>
        {isReady && <div className="seed-ready-glow" />}
      </div>

      <p className="seed-plant-name">{plant?.name || '???'}</p>

      <div className="seed-progress-row">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`seed-pip ${seed.wateredDays.length > i ? 'filled' : ''}`}
          />
        ))}
      </div>
      <p className="seed-stage-label">{stageInfo.label}</p>

      {isReady ? (
        <button className="seed-action-btn harvest-btn" onClick={() => onHarvest(seed.id)}>
          🌿 수확하기
        </button>
      ) : (
        <button
          className={`seed-action-btn water-btn ${wateredToday ? 'watered' : ''}`}
          onClick={() => !wateredToday && onWater(seed.id)}
          disabled={wateredToday}
        >
          {wateredToday ? '💧 물줌 ✓' : '💧 물주기'}
        </button>
      )}
    </div>
  );
}

/* ─── 탐험 카드 ─────────────────────────────────────────── */
function ExpeditionCard({ expedition, onStart, coins, allAcquired }) {
  const canAfford = coins >= expedition.cost;

  return (
    <div
      className={`exp-card ${allAcquired ? 'exp-complete' : ''}`}
      style={{ background: expedition.bgGradient, borderColor: expedition.borderColor }}
    >
      <div className="exp-card-head">
        <span className="exp-card-emoji">{expedition.emoji}</span>
        <div className="exp-card-titles">
          <h3 className="exp-card-name">{expedition.name}</h3>
          <span
            className="exp-rarity-tag"
            style={{ background: expedition.tagBg, color: expedition.tagText }}
          >
            {expedition.rarityLabel} 발견 가능
          </span>
        </div>
      </div>

      <p className="exp-card-desc">{expedition.description}</p>

      <div className="exp-card-foot">
        {allAcquired ? (
          <div className="exp-done-badge">
            <span>✓</span>
            <span>이 종류는 모두 보유 중이에요</span>
          </div>
        ) : (
          <button
            className="exp-start-btn"
            onClick={() => onStart(expedition)}
            disabled={!canAfford}
            title={!canAfford ? '코인이 부족해요' : ''}
          >
            <span className="exp-cost">🪙 {expedition.cost}코인</span>
            <span className="exp-go">{canAfford ? '탐험 →' : '코인 부족'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── 탐험 중 화면 ──────────────────────────────────────── */
function SearchingScreen({ expedition }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  const hints = [
    expedition.searchMsg,
    '풀잎이 바스락거리는 소리가 들려요...',
    '조금만 더 찾아볼까요? 🔍',
    '분명 어딘가에 있을 거예요!',
  ];

  useEffect(() => {
    const prog = setInterval(() => setProgress(p => Math.min(100, p + 3.5)), 90);
    const msg = setInterval(() => setMsgIdx(i => (i + 1) % hints.length), 900);
    return () => { clearInterval(prog); clearInterval(msg); };
  }, []);

  return (
    <div className="searching-screen">
      <div className="searching-env">{expedition.emoji}</div>

      <div className="searching-anim-wrap">
        <div className="orbit-ring">
          {['🍃', '🌿', '🍀'].map((leaf, i) => (
            <span
              key={i}
              className="orbit-leaf"
              style={{ animationDelay: `${i * 0.85}s` }}
            >
              {leaf}
            </span>
          ))}
        </div>
        <div className="orbit-center">🔍</div>
      </div>

      <p className="searching-msg">{hints[msgIdx]}</p>

      <div className="search-progress-track">
        <div className="search-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="search-percent">{Math.round(progress)}%</p>
    </div>
  );
}

/* ─── 식물 발견 화면 ─────────────────────────────────────── */
function FoundScreen({ result, onClaim }) {
  if (!result) return null;
  const { plant, expedition } = result;
  const rarityStyle = RARITY_COLOR[plant.rarity];

  return (
    <div className="found-screen">
      {/* 폭죽 파티클 */}
      <div className="found-confetti">
        {['✨', '⭐', '🌟', '💫', '✨'].map((s, i) => (
          <span key={i} className="confetti-star" style={{ '--i': i }}>{s}</span>
        ))}
      </div>

      <div className="found-top">
        <p className="found-location-tag">{expedition.emoji} {expedition.name}에서 발견!</p>
        <h2 className="found-title">새로운 식물을 발견했어요!</h2>
        <p className="found-found-msg">{expedition.foundMsg}</p>
      </div>

      {/* 식물 카드 */}
      <div className="found-plant-card" style={{ borderColor: plant.color }}>
        <div
          className="found-plant-emoji-bg"
          style={{ background: plant.bgColor }}
        >
          <span className="found-plant-emoji">{plant.emoji}</span>
        </div>

        <div className="found-plant-body">
          <h3 className="found-plant-name">{plant.name}</h3>
          <p className="found-plant-latin">{plant.latinName}</p>

          <span
            className="found-plant-rarity"
            style={{ background: rarityStyle.bg, color: rarityStyle.text }}
          >
            {RARITY_LABEL[plant.rarity]}
          </span>

          <div className="found-keywords">
            {plant.moodKeywords.map(k => (
              <span key={k} className="found-keyword">#{k}</span>
            ))}
          </div>

          <p className="found-plant-desc">{plant.description}</p>

          <div className="found-plant-meta">
            <span>☀️ {plant.lightNeeds}</span>
            <span>💧 {plant.waterNeeds}</span>
            <span>📐 {plant.size === 'small' ? '소형' : plant.size === 'medium' ? '중형' : '대형'}</span>
          </div>
        </div>
      </div>

      <button className="btn-claim" onClick={onClaim}>
        🌿 가게로 가져가기
      </button>
    </div>
  );
}

/* ─── 메인 발견 화면 ─────────────────────────────────────── */
export default function PlantDiscoveryScreen() {
  const { state, dispatch } = useGame();
  const { coins, seeds, expeditionResult, day } = state;

  const [activeTab, setActiveTab] = useState('expedition');
  const [phase, setPhase] = useState('select');     // 'select' | 'searching' | 'found'
  const [activeExp, setActiveExp] = useState(null);

  function handleStartExpedition(expedition) {
    setActiveExp(expedition);
    setPhase('searching');
    dispatch({ type: 'START_EXPEDITION', payload: { expeditionId: expedition.id } });
    setTimeout(() => setPhase('found'), 2700);
  }

  function handleClaim() {
    if (state.expeditionResult) {
      dispatch({ type: 'CLAIM_DISCOVERY', payload: { plantId: state.expeditionResult.plant.id } });
    }
    setPhase('select');
    setActiveExp(null);
  }

  function isAllAcquired(rarity) {
    return PLANTS.filter(p => p.rarity === rarity).every(p =>
      state.acquiredPlantIds.includes(p.id)
    );
  }

  const readySeeds = seeds.filter(s => getSeedStage(s) >= 3).length;

  /* 탐험 중 화면 */
  if (phase === 'searching' && activeExp) {
    return (
      <div className="discovery-screen">
        <div className="screen-header">
          <span className="screen-title">{activeExp.name} 중...</span>
        </div>
        <SearchingScreen expedition={activeExp} />
      </div>
    );
  }

  /* 발견 화면 */
  if (phase === 'found') {
    /* 코인이 없어 탐험 결과가 null인 경우 (모두 보유) */
    if (!state.expeditionResult) {
      setPhase('select');
      return null;
    }
    return (
      <div className="discovery-screen">
        <FoundScreen result={state.expeditionResult} onClaim={handleClaim} />
      </div>
    );
  }

  /* 기본 선택 화면 */
  return (
    <div className="discovery-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'main' })}>
          ←
        </button>
        <span className="screen-title">식물 탐험</span>
        <div className="disc-coins">
          <span>🪙</span>
          <span>{coins}</span>
        </div>
      </div>

      {/* 탭 */}
      <div className="discovery-tabs">
        <button
          className={`disc-tab ${activeTab === 'expedition' ? 'active' : ''}`}
          onClick={() => setActiveTab('expedition')}
        >
          🗺️ 탐험하기
        </button>
        <button
          className={`disc-tab ${activeTab === 'garden' ? 'active' : ''}`}
          onClick={() => setActiveTab('garden')}
        >
          🌱 씨앗 정원
          {seeds.length > 0 && (
            <span className={`disc-tab-badge ${readySeeds > 0 ? 'ready' : ''}`}>
              {readySeeds > 0 ? `${readySeeds}수확!` : seeds.length}
            </span>
          )}
        </button>
      </div>

      <div className="scroll-area">
        {/* ── 탐험 탭 ── */}
        {activeTab === 'expedition' && (
          <div className="expedition-tab-content">
            <div className="disc-tip">
              <span>🌟</span>
              <p>탐험 유형마다 다른 희귀도의 식물을 발견할 수 있어요. 코인을 모아 더 깊은 곳을 탐험해보세요!</p>
            </div>

            <div className="exp-list">
              {EXPEDITIONS.map(exp => (
                <ExpeditionCard
                  key={exp.id}
                  expedition={exp}
                  onStart={handleStartExpedition}
                  coins={coins}
                  allAcquired={isAllAcquired(exp.targetRarity)}
                />
              ))}
            </div>

            {/* 탐험 가이드 */}
            <div className="exp-guide">
              <p className="exp-guide-title">탐험 안내</p>
              <div className="exp-guide-rows">
                <div className="exp-guide-row">
                  <span>🏘️ 골목 탐색</span>
                  <span>일반 식물 · 20코인</span>
                </div>
                <div className="exp-guide-row">
                  <span>🌲 숲길 탐험</span>
                  <span>희귀 식물 · 50코인</span>
                </div>
                <div className="exp-guide-row">
                  <span>🏔️ 깊은 산 채집</span>
                  <span>전설 식물 · 80코인</span>
                </div>
              </div>
              <p className="exp-guide-note">이미 보유한 종류라면 코인을 일부 환급해드려요</p>
            </div>
          </div>
        )}

        {/* ── 씨앗 정원 탭 ── */}
        {activeTab === 'garden' && (
          <div className="garden-tab-content">
            <div className="disc-tip">
              <span>💡</span>
              <p>씨앗에 물을 3번 주면 완전히 자라요. 손님을 행복하게 해주면 씨앗을 선물 받을 수 있어요!</p>
            </div>

            {seeds.length === 0 ? (
              <div className="garden-empty">
                <div className="garden-empty-visual">
                  <span className="garden-empty-pot">🪴</span>
                  <span className="garden-empty-sprout">🌱</span>
                </div>
                <p className="garden-empty-title">씨앗 정원이 비어있어요</p>
                <p className="garden-empty-sub">
                  손님에게 딱 맞는 식물을 추천해주면<br />
                  감사의 씨앗을 선물 받을 수 있어요 🌰
                </p>
              </div>
            ) : (
              <>
                {readySeeds > 0 && (
                  <div className="garden-ready-banner">
                    ✨ {readySeeds}개의 식물이 수확을 기다리고 있어요!
                  </div>
                )}
                <div className="seed-garden-grid">
                  {seeds.map(seed => (
                    <SeedPot
                      key={seed.id}
                      seed={seed}
                      currentDay={day}
                      onWater={seedId => dispatch({ type: 'WATER_SEED', payload: { seedId } })}
                      onHarvest={seedId => dispatch({ type: 'HARVEST_SEED', payload: { seedId } })}
                    />
                  ))}
                </div>
              </>
            )}

            {/* 씨앗 성장 가이드 */}
            <div className="seed-guide">
              <p className="seed-guide-title">씨앗 성장 단계</p>
              <div className="seed-stages-row">
                {SEED_STAGE_INFO.map((s, i) => (
                  <div key={i} className="seed-stage-step">
                    <span className="seed-stage-step-emoji">{s.emoji}</span>
                    <span className="seed-stage-step-label">{s.label}</span>
                    {i < 3 && <span className="seed-stage-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

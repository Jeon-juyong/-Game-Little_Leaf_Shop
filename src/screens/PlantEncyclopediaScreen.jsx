import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PLANTS, RARITY_LABEL, RARITY_COLOR } from '../data/plants';
import './PlantEncyclopediaScreen.css';

const FILTERS = ['전체', '일반', '희귀', '전설'];
const RARITY_MAP = { '일반': 'common', '희귀': 'uncommon', '전설': 'rare' };

function PlantDetailModal({ plant, onClose, onBuy, coins, acquired }) {
  const rarityStyle = RARITY_COLOR[plant.rarity];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="enc-detail-header" style={{ background: plant.bgColor }}>
          <span className="enc-detail-emoji">{plant.emoji}</span>
          <div>
            <h2 className="enc-detail-name">{plant.name}</h2>
            <p className="enc-detail-latin">{plant.latinName}</p>
            <span
              className="enc-detail-rarity"
              style={{ background: rarityStyle.bg, color: rarityStyle.text }}
            >
              {RARITY_LABEL[plant.rarity]}
            </span>
          </div>
        </div>

        <p className="enc-detail-desc">{plant.description}</p>

        <div className="enc-detail-meta">
          <div className="meta-row">
            <span className="meta-label">☀️ 빛</span>
            <span className="meta-value">{plant.lightNeeds}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">💧 물</span>
            <span className="meta-value">{plant.waterNeeds}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">🌡️ 난이도</span>
            <span className="meta-value">{plant.difficulty}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">📐 크기</span>
            <span className="meta-value">
              {plant.size === 'small' ? '소형' : plant.size === 'medium' ? '중형' : '대형'}
            </span>
          </div>
        </div>

        <div className="enc-detail-keywords">
          {plant.moodKeywords.map(k => (
            <span key={k} className="enc-keyword">#{k}</span>
          ))}
        </div>

        {acquired ? (
          <div className="enc-owned-badge">✓ 보유 중</div>
        ) : (
          <button
            className="btn-primary"
            onClick={() => onBuy(plant.id)}
            disabled={coins < plant.basePrice}
          >
            🪙 {plant.basePrice.toLocaleString()}원에 구매하기
            {coins < plant.basePrice && ' (코인 부족)'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PlantEncyclopediaScreen() {
  const { state, dispatch } = useGame();
  const { unlockedPlantIds, acquiredPlantIds, coins } = state;
  const [filter, setFilter] = useState('전체');
  const [selectedPlant, setSelectedPlant] = useState(null);

  const filtered = PLANTS.filter(p => {
    if (filter === '전체') return true;
    return p.rarity === RARITY_MAP[filter];
  });

  const total = PLANTS.length;
  const unlocked = unlockedPlantIds.length;

  function handleBuy(plantId) {
    dispatch({ type: 'BUY_PLANT', payload: { plantId } });
    setSelectedPlant(null);
  }

  return (
    <div className="encyclopedia-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'main' })}>
          ←
        </button>
        <span className="screen-title">식물 도감</span>
        <span className="enc-progress">{unlocked}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="enc-progress-bar-wrap">
        <div className="enc-progress-bar">
          <div
            className="enc-progress-fill"
            style={{ width: `${(unlocked / total) * 100}%` }}
          />
        </div>
        <p className="enc-progress-text">
          {unlocked}종 발견 · {total - unlocked}종 미발견
        </p>
      </div>

      {/* Filter tabs */}
      <div className="enc-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`enc-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Plant grid */}
      <div className="scroll-area">
        <div className="enc-grid">
          {filtered.map(plant => {
            const isUnlocked = unlockedPlantIds.includes(plant.id);
            const isAcquired = acquiredPlantIds.includes(plant.id);
            const rarityStyle = RARITY_COLOR[plant.rarity];

            return (
              <button
                key={plant.id}
                className={`enc-plant-card ${!isUnlocked ? 'locked' : ''} ${isAcquired ? 'acquired' : ''}`}
                onClick={() => isUnlocked && setSelectedPlant(plant)}
              >
                <div
                  className="enc-plant-emoji-wrap"
                  style={isUnlocked ? { background: plant.bgColor } : { background: '#E0E0E0' }}
                >
                  {isUnlocked ? (
                    <span className="enc-plant-emoji">{plant.emoji}</span>
                  ) : (
                    <span className="enc-plant-lock">🔒</span>
                  )}
                  {isAcquired && <div className="enc-acquired-dot" />}
                </div>

                <div className="enc-plant-info">
                  <p className="enc-plant-name">
                    {isUnlocked ? plant.name : '???'}
                  </p>
                  <span
                    className="enc-plant-rarity"
                    style={isUnlocked
                      ? { background: rarityStyle.bg, color: rarityStyle.text }
                      : { background: '#E0E0E0', color: '#9E9E9E' }
                    }
                  >
                    {RARITY_LABEL[plant.rarity]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onBuy={handleBuy}
          coins={coins}
          acquired={acquiredPlantIds.includes(selectedPlant.id)}
        />
      )}
    </div>
  );
}

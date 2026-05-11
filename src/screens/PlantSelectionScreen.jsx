import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PLANTS, RARITY_LABEL, RARITY_COLOR, calcMatchScore } from '../data/plants';
import './PlantSelectionScreen.css';

function PlantCard({ plant, isSelected, onClick, matchScore }) {
  const rarityStyle = RARITY_COLOR[plant.rarity];
  return (
    <button
      className={`plant-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={isSelected ? { borderColor: plant.color } : {}}
    >
      <div
        className="plant-card-emoji-wrap"
        style={{ background: plant.bgColor }}
      >
        <span className="plant-card-emoji">{plant.emoji}</span>
        {matchScore !== null && (
          <div
            className="match-chip"
            style={{
              background: matchScore >= 60 ? '#E8F5E9' : matchScore >= 30 ? '#FFF8E1' : '#FFEBEE',
              color: matchScore >= 60 ? '#2E7D32' : matchScore >= 30 ? '#F57F17' : '#C62828',
            }}
          >
            {matchScore >= 60 ? '😊' : matchScore >= 30 ? '😐' : '😔'}
          </div>
        )}
      </div>
      <div className="plant-card-info">
        <p className="plant-card-name">{plant.name}</p>
        <span
          className="plant-card-rarity"
          style={{ background: rarityStyle.bg, color: rarityStyle.text }}
        >
          {RARITY_LABEL[plant.rarity]}
        </span>
      </div>
      {isSelected && <div className="selected-ring" style={{ borderColor: plant.color }} />}
    </button>
  );
}

export default function PlantSelectionScreen() {
  const { state, dispatch } = useGame();
  const { acquiredPlantIds, todaysCustomers } = state;
  const [selectedId, setSelectedId] = useState(null);

  const customer = todaysCustomers.find(c => !c.served);
  if (!customer) {
    dispatch({ type: 'GO_SCREEN', payload: 'main' });
    return null;
  }

  const availablePlants = PLANTS.filter(p => acquiredPlantIds.includes(p.id));
  const selectedPlant = availablePlants.find(p => p.id === selectedId);

  function handleRecommend() {
    if (!selectedId) return;
    dispatch({
      type: 'RECOMMEND_PLANT',
      payload: { customerId: customer.id, plantId: selectedId },
    });
  }

  return (
    <div className="plant-select-screen">
      <div className="plant-select-header">
        <button className="back-btn" onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'customer' })}>
          ←
        </button>
        <span className="screen-title">식물 고르기</span>
      </div>

      {/* Customer context */}
      <div className="select-context">
        <span className="context-avatar">{customer.avatar}</span>
        <div className="context-info">
          <p className="context-name">{customer.name}님의 요청</p>
          <p className="context-request">{customer.request.slice(0, 40)}…</p>
          <div className="context-tags">
            {customer.needs.map(n => (
              <span key={n} className="context-tag">#{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Plant grid */}
      <div className="plant-grid-scroll">
        <div className="plant-grid">
          {availablePlants.map(plant => {
            const score = selectedId ? null : calcMatchScore(customer.needs, plant.moodKeywords);
            return (
              <PlantCard
                key={plant.id}
                plant={plant}
                isSelected={selectedId === plant.id}
                onClick={() => setSelectedId(selectedId === plant.id ? null : plant.id)}
                matchScore={score}
              />
            );
          })}
        </div>
      </div>

      {/* Selected plant detail */}
      {selectedPlant && (
        <div className="plant-detail-panel">
          <div className="detail-header">
            <div className="detail-emoji-wrap" style={{ background: selectedPlant.bgColor }}>
              <span className="detail-emoji">{selectedPlant.emoji}</span>
            </div>
            <div className="detail-info">
              <h3 className="detail-name">{selectedPlant.name}</h3>
              <p className="detail-latin">{selectedPlant.latinName}</p>
              <div className="detail-meta">
                <span>☀️ {selectedPlant.lightNeeds}</span>
                <span>💧 {selectedPlant.waterNeeds}</span>
              </div>
            </div>
          </div>
          <div className="detail-keywords">
            {selectedPlant.moodKeywords.map(k => {
              const matched = customer.needs.includes(k);
              return (
                <span
                  key={k}
                  className={`keyword-tag ${matched ? 'matched' : ''}`}
                >
                  {matched && '✓ '}#{k}
                </span>
              );
            })}
          </div>
          <p className="detail-desc">{selectedPlant.description}</p>
        </div>
      )}

      {/* Recommend button */}
      <div className="plant-select-action">
        {!selectedPlant && (
          <p className="select-hint">식물을 선택해주세요</p>
        )}
        <button
          className="btn-primary"
          disabled={!selectedId}
          onClick={handleRecommend}
        >
          {selectedPlant ? `${selectedPlant.emoji} ${selectedPlant.name} 추천하기` : '식물을 선택해주세요'}
        </button>
      </div>
    </div>
  );
}

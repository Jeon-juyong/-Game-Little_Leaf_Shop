import { useGame } from '../context/GameContext';
import './ResultScreen.css';

const SATISFACTION_CONFIG = {
  high: {
    emoji: '😊',
    label: '매우 만족!',
    color: '#2E7D32',
    bg: '#E8F5E9',
    stars: '⭐⭐⭐',
    coinBonus: '+5 코인',
  },
  medium: {
    emoji: '😌',
    label: '만족',
    color: '#F57F17',
    bg: '#FFF8E1',
    stars: '⭐⭐',
    coinBonus: '+3 코인',
  },
  low: {
    emoji: '😔',
    label: '아쉬워요',
    color: '#C62828',
    bg: '#FFEBEE',
    stars: '⭐',
    coinBonus: '+1 코인',
  },
};

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { pendingResult, todaysCustomers } = state;

  if (!pendingResult) {
    dispatch({ type: 'GO_SCREEN', payload: 'main' });
    return null;
  }

  const { customer, plant, level, coins, unlockMsg, seedGift, message } = pendingResult;
  const config = SATISFACTION_CONFIG[level];
  const remaining = todaysCustomers.filter(c => !c.served).length;

  return (
    <div className="result-screen">
      {/* Satisfaction header */}
      <div className="result-header" style={{ background: config.bg }}>
        <div className="result-face">{config.emoji}</div>
        <div className="result-label" style={{ color: config.color }}>{config.label}</div>
        <div className="result-stars">{config.stars}</div>
      </div>

      <div className="result-scroll">
        {/* Customer response */}
        <div className="result-card">
          <div className="result-customer-row">
            <div className="result-avatar-wrap" style={{ background: customer.avatarBg }}>
              <span className="result-avatar">{customer.avatar}</span>
            </div>
            <div>
              <p className="result-customer-name">{customer.name}님</p>
              <p className="result-customer-mood">{customer.moodEmoji} {customer.mood}</p>
            </div>
          </div>

          <div className="result-speech">
            <p className="result-message">"{message}"</p>
          </div>
        </div>

        {/* Plant recommendation */}
        <div className="result-plant-card">
          <p className="result-section-label">추천한 식물</p>
          <div className="result-plant-row">
            <div className="result-plant-emoji-wrap" style={{ background: plant.bgColor }}>
              <span className="result-plant-emoji">{plant.emoji}</span>
            </div>
            <div>
              <p className="result-plant-name">{plant.name}</p>
              <p className="result-plant-latin">{plant.latinName}</p>
              <div className="result-plant-keywords">
                {plant.moodKeywords.map(k => (
                  <span
                    key={k}
                    className={`result-keyword ${customer.needs.includes(k) ? 'matched' : ''}`}
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="result-rewards">
          <p className="result-section-label">받은 보상</p>
          <div className="result-reward-row">
            <div className="reward-item coin-reward">
              <span className="reward-icon">🪙</span>
              <span className="reward-text">{config.coinBonus}</span>
            </div>
            {level === 'high' && (
              <div className="reward-item letter-reward">
                <span className="reward-icon">💌</span>
                <span className="reward-text">감사 편지</span>
              </div>
            )}
            {seedGift && (
              <div className="reward-item seed-reward">
                <span className="reward-icon">🌱</span>
                <span className="reward-text">{seedGift.plant.name} 씨앗</span>
              </div>
            )}
          </div>
          {seedGift && (
            <div className="seed-gift-banner">
              <span>🌰</span>
              <div>
                <p className="seed-gift-title">{seedGift.plant.name} 씨앗을 받았어요!</p>
                <p className="seed-gift-sub">씨앗 정원에서 물을 주면 가게의 새 식물이 돼요 🌿</p>
              </div>
            </div>
          )}
          {unlockMsg && (
            <div className="unlock-banner">
              <span className="unlock-icon">🎉</span>
              <span className="unlock-text">{unlockMsg}</span>
            </div>
          )}
        </div>

        {/* Match breakdown */}
        <div className="result-match">
          <p className="result-section-label">매칭 분석</p>
          <div className="match-breakdown">
            <p className="match-label">손님이 원하는 것</p>
            <div className="match-needs">
              {customer.needs.map(need => {
                const matched = plant.moodKeywords.includes(need);
                return (
                  <div key={need} className={`match-need ${matched ? 'matched' : 'missed'}`}>
                    <span>{matched ? '✓' : '✗'}</span>
                    <span>{need}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Next action */}
      <div className="result-action">
        {remaining > 0 ? (
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'customer' })}
          >
            👤 다음 손님 만나기 ({remaining}명 남음)
          </button>
        ) : (
          <button
            className="btn-amber"
            onClick={() => dispatch({ type: 'NEXT_DAY' })}
          >
            🌙 오늘 하루 마무리하기
          </button>
        )}
        <button
          className="btn-secondary"
          style={{ marginTop: 8 }}
          onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'main' })}
        >
          가게로 돌아가기
        </button>
      </div>
    </div>
  );
}

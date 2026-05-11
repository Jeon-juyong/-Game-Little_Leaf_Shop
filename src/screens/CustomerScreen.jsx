import { useGame } from '../context/GameContext';
import './CustomerScreen.css';

export default function CustomerScreen() {
  const { state, dispatch } = useGame();
  const { todaysCustomers } = state;

  const customer = todaysCustomers.find(c => !c.served);

  if (!customer) {
    dispatch({ type: 'GO_SCREEN', payload: 'main' });
    return null;
  }

  const remaining = todaysCustomers.filter(c => !c.served).length;
  const total = todaysCustomers.length;
  const done = total - remaining;

  return (
    <div className="customer-screen">
      <div className="customer-screen-header">
        <button className="back-btn" onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'main' })}>
          ←
        </button>
        <span className="screen-title">오늘의 손님</span>
        <span className="customer-progress">{done + 1}/{total}</span>
      </div>

      <div className="customer-scroll">
        {/* Customer Card */}
        <div className="customer-card">
          <div className="customer-avatar-wrap" style={{ background: customer.avatarBg }}>
            <span className="customer-avatar">{customer.avatar}</span>
            <div className="mood-badge">
              <span>{customer.moodEmoji}</span>
              <span>{customer.mood}</span>
            </div>
          </div>

          <div className="customer-info">
            <h2 className="customer-name">{customer.name}</h2>
            <div className="customer-separator">· · ·</div>
          </div>

          {/* Speech bubble */}
          <div className="speech-bubble">
            <div className="bubble-tail" />
            <p className="bubble-text">{customer.request}</p>
          </div>

          {/* Needs tags */}
          <div className="customer-needs">
            <p className="needs-label">손님이 원하는 것</p>
            <div className="needs-tags">
              {customer.needs.map(need => (
                <span key={need} className="need-tag">#{need}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tip card */}
        <div className="tip-card">
          <span className="tip-icon">💡</span>
          <p className="tip-text">
            손님의 이야기를 잘 읽고 마음에 어울리는 식물을 골라주세요.
            키워드가 잘 맞을수록 손님이 기뻐해요!
          </p>
        </div>
      </div>

      {/* Action button */}
      <div className="customer-action">
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'plant-select' })}
        >
          🌿 추천할 식물 고르기
        </button>
      </div>
    </div>
  );
}

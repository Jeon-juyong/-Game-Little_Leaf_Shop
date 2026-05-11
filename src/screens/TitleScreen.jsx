import { useGame } from '../context/GameContext';
import './TitleScreen.css';

const LEAVES = ['🍃', '🌿', '🍀', '🌱', '🍂'];

function FloatingLeaf({ index }) {
  const style = {
    left: `${10 + index * 17}%`,
    animationDelay: `${index * 1.2}s`,
    animationDuration: `${6 + index * 1.5}s`,
    fontSize: `${18 + (index % 3) * 8}px`,
  };
  return (
    <span className="floating-leaf" style={style}>
      {LEAVES[index % LEAVES.length]}
    </span>
  );
}

export default function TitleScreen() {
  const { dispatch, hasSave, getSave } = useGame();

  function handleStart() {
    dispatch({ type: 'START_NEW_GAME' });
  }

  function handleContinue() {
    const save = getSave();
    if (save) dispatch({ type: 'LOAD_GAME', payload: save });
  }

  return (
    <div className="title-screen">
      {/* Animated background leaves */}
      <div className="leaves-container">
        {Array.from({ length: 8 }).map((_, i) => (
          <FloatingLeaf key={i} index={i} />
        ))}
      </div>

      {/* Top decorative area */}
      <div className="title-top">
        <div className="shop-preview">
          <div className="preview-window">🪟</div>
          <div className="preview-shelf">
            <span>🌿</span>
            <span>🪴</span>
            <span>🌸</span>
          </div>
          <div className="preview-counter">
            <span>🌱</span>
            <span>🏪</span>
            <span>🌵</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="title-content">
        <div className="title-logo">🌿</div>
        <h1 className="title-name">작은 잎새 상점</h1>
        <p className="title-sub">손님의 마음에 어울리는 식물을 골라주세요</p>
        <div className="title-divider">· · ·</div>
      </div>

      {/* Buttons */}
      <div className="title-buttons">
        <button className="title-btn title-btn-primary" onClick={handleStart}>
          <span className="btn-icon">🌱</span>
          새로 시작하기
        </button>
        <button
          className={`title-btn title-btn-secondary ${!hasSave() ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!hasSave()}
        >
          <span className="btn-icon">📖</span>
          이어하기
        </button>
        <p className="title-credit">캐주얼 힐링 게임 · 작은 잎새 상점</p>
      </div>

      {/* Decorative bottom */}
      <div className="title-bottom-deco">
        <span>🌿</span>
        <span>🌸</span>
        <span>🍃</span>
        <span>🌷</span>
        <span>🍀</span>
      </div>
    </div>
  );
}

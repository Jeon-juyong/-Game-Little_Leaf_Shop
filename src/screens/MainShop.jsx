import { useGame } from '../context/GameContext';
import { PLANTS } from '../data/plants';
import { getDecorationById } from '../data/decorations';
import { getSeedStage } from '../data/expeditions';
import './MainShop.css';

const WEATHER = ['☀️', '⛅', '🌤️', '🌥️'];

function ShopInterior() {
  const { state } = useGame();
  const { acquiredPlantIds, shopDecorations, day } = state;

  const weather = WEATHER[day % WEATHER.length];

  const getZoneDeco = (zoneId) => {
    const placed = shopDecorations.find(d => d.zoneId === zoneId);
    if (!placed) return null;
    return getDecorationById(placed.decorationId);
  };

  const acquiredPlants = PLANTS.filter(p => acquiredPlantIds.includes(p.id));
  const displayPlants = acquiredPlants.slice(0, 6);

  return (
    <div className="shop-interior">
      {/* Sky/Wall area */}
      <div className="shop-wall">
        <div className="wall-weather">{weather}</div>
        <div className="shop-window">
          <div className="window-inner">
            <div className="window-cross-h" />
            <div className="window-cross-v" />
          </div>
          <div className="window-sill">
            {displayPlants.slice(0, 2).map((p, i) => (
              <span key={i} className="sill-plant">{p.emoji}</span>
            ))}
          </div>
        </div>

        <div className="wall-shelf">
          <div className="shelf-board" />
          <div className="shelf-items">
            {getZoneDeco('shelf-tl') && (
              <span className="shelf-item">{getZoneDeco('shelf-tl').emoji}</span>
            )}
            {displayPlants.slice(2, 4).map((p, i) => (
              <span key={i} className="shelf-item">{p.emoji}</span>
            ))}
            {getZoneDeco('shelf-tr') && (
              <span className="shelf-item">{getZoneDeco('shelf-tr').emoji}</span>
            )}
          </div>
          <div className="shelf-board" />
          <div className="shelf-items">
            {displayPlants.slice(4, 6).map((p, i) => (
              <span key={i} className="shelf-item">{p.emoji}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Counter area */}
      <div className="shop-counter-area">
        <div className="counter-top">
          <span className="counter-item">🌱</span>
          <span className="counter-register">🏪</span>
          <span className="counter-item">
            {getZoneDeco('watering-can') ? getZoneDeco('watering-can').emoji : '🪴'}
          </span>
        </div>
        <div className="counter-body" />
      </div>

      {/* Floor area */}
      <div className="shop-floor">
        <div className="floor-left">
          {getZoneDeco('floor-tl') && (
            <span className="floor-deco">{getZoneDeco('floor-tl').emoji}</span>
          )}
          {getZoneDeco('basket-wicker') && (
            <span className="floor-deco">{getZoneDeco('basket-wicker').emoji}</span>
          )}
        </div>
        <div className="floor-right">
          {getZoneDeco('floor-r') && (
            <span className="floor-deco">{getZoneDeco('floor-r').emoji}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function NavButton({ emoji, label, onClick, badge }) {
  return (
    <button className="nav-btn" onClick={onClick}>
      <span className="nav-icon">{emoji}</span>
      {badge > 0 && <span className="nav-badge">{badge}</span>}
      <span className="nav-label">{label}</span>
    </button>
  );
}

export default function MainShop() {
  const { state, dispatch } = useGame();
  const { day, coins, todaysCustomers, servedCount, letters, seeds, toast } = state;

  const remainingCustomers = todaysCustomers.filter(c => !c.served).length;
  const allServed = todaysCustomers.length > 0 && todaysCustomers.every(c => c.served);
  const unreadLetters = letters.filter(l => !l.read).length;
  const readySeeds = (seeds || []).filter(s => getSeedStage(s) >= 3).length;

  function handleCustomer() {
    const next = todaysCustomers.find(c => !c.served);
    if (!next) return;
    dispatch({ type: 'GO_SCREEN', payload: 'customer' });
  }

  return (
    <div className="main-screen">
      {/* Header */}
      <div className="main-header">
        <div className="header-left">
          <div className="shop-name-badge">🌿 작은 잎새 상점</div>
          <div className="day-badge">Day {day}</div>
        </div>
        <div className="header-coins">
          <span className="coin-icon">🪙</span>
          <span className="coin-amount">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Shop Interior */}
      <div className="shop-container">
        <ShopInterior />
      </div>

      {/* Status bar */}
      <div className="status-bar">
        {allServed ? (
          <div className="status-all-done">
            <span>오늘 손님을 모두 맞이했어요! 🎉</span>
            <button className="btn-next-day" onClick={() => dispatch({ type: 'NEXT_DAY' })}>
              다음 날로 →
            </button>
          </div>
        ) : (
          <div className="status-info">
            <span className="status-text">
              오늘 남은 손님{' '}
              <strong>{remainingCustomers}명</strong>
            </span>
            {remainingCustomers > 0 && (
              <button className="btn-serve" onClick={handleCustomer}>
                손님 맞이하기 →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <NavButton
          emoji="👤"
          label="오늘의 손님"
          onClick={handleCustomer}
          badge={remainingCustomers}
        />
        <NavButton
          emoji="🗺️"
          label="식물 탐험"
          onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'discovery' })}
          badge={readySeeds}
        />
        <NavButton
          emoji="📖"
          label="식물 도감"
          onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'encyclopedia' })}
        />
        <NavButton
          emoji="🏠"
          label="가게 꾸미기"
          onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'decorate' })}
        />
        <NavButton
          emoji="📦"
          label="보관함"
          onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'storage' })}
          badge={unreadLetters}
        />
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DECORATIONS, SHOP_GRID, getDecorationById } from '../data/decorations';
import './ShopDecorateScreen.css';

export default function ShopDecorateScreen() {
  const { state, dispatch } = useGame();
  const { shopDecorations, unlockedDecorationIds } = state;
  const [selectedZone, setSelectedZone] = useState(null);
  const [saved, setSaved] = useState(false);

  const availableDecos = DECORATIONS.filter(d => unlockedDecorationIds.includes(d.id));

  function getPlacedDeco(zoneId) {
    const placed = shopDecorations.find(d => d.zoneId === zoneId);
    if (!placed) return null;
    return getDecorationById(placed.decorationId);
  }

  function handleZoneClick(zone) {
    if (zone.fixed) return;
    setSelectedZone(selectedZone?.id === zone.id ? null : zone);
  }

  function handlePlace(decorationId) {
    dispatch({
      type: 'PLACE_DECORATION',
      payload: { zoneId: selectedZone.id, decorationId },
    });
    setSelectedZone(null);
  }

  function handleRemove() {
    dispatch({
      type: 'PLACE_DECORATION',
      payload: { zoneId: selectedZone.id, decorationId: null },
    });
    setSelectedZone(null);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      dispatch({ type: 'GO_SCREEN', payload: 'main' });
    }, 800);
  }

  const selectedZoneCompatibleDecos = selectedZone
    ? availableDecos.filter(d => selectedZone.allowTypes.includes(d.type))
    : [];

  return (
    <div className="decorate-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'main' })}>
          ←
        </button>
        <span className="screen-title">가게 꾸미기</span>
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ 저장됨' : '저장'}
        </button>
      </div>

      <div className="decorate-scroll">
        {/* Instructions */}
        <div className="decorate-tip">
          <span>💡</span>
          <span>칸을 눌러 소품을 배치하거나 변경해보세요</span>
        </div>

        {/* Shop Grid */}
        <div className="shop-grid-container">
          <div className="shop-grid-label-row">
            <span>선반</span>
            <span>창가</span>
            <span>벽</span>
          </div>

          <div className="shop-grid">
            {SHOP_GRID.zones.map(zone => {
              const placedDeco = getPlacedDeco(zone.id);
              const isSelected = selectedZone?.id === zone.id;
              return (
                <button
                  key={zone.id}
                  className={`grid-zone ${isSelected ? 'selected' : ''} ${zone.fixed ? 'fixed' : ''}`}
                  onClick={() => handleZoneClick(zone)}
                  style={{
                    gridColumn: zone.x + 1,
                    gridRow: zone.y + 1,
                  }}
                >
                  {zone.fixed ? (
                    <span className="zone-fixed-emoji">{zone.fixedEmoji}</span>
                  ) : placedDeco ? (
                    <span className="zone-deco-emoji">{placedDeco.emoji}</span>
                  ) : (
                    <span className="zone-empty">+</span>
                  )}
                  <span className="zone-label">{zone.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decoration Palette */}
        {selectedZone ? (
          <div className="deco-palette">
            <div className="palette-header">
              <p className="palette-title">
                {selectedZone.label}에 배치할 소품 선택
              </p>
              <button className="palette-close" onClick={() => setSelectedZone(null)}>✕</button>
            </div>

            {selectedZoneCompatibleDecos.length === 0 ? (
              <p className="palette-empty">이 공간에 배치할 수 있는 소품이 없어요</p>
            ) : (
              <div className="deco-list">
                <button className="deco-item remove-item" onClick={handleRemove}>
                  <span className="deco-item-emoji">🗑️</span>
                  <span className="deco-item-name">비우기</span>
                </button>
                {selectedZoneCompatibleDecos.map(deco => (
                  <button
                    key={deco.id}
                    className={`deco-item ${shopDecorations.some(d => d.zoneId === selectedZone.id && d.decorationId === deco.id) ? 'active' : ''}`}
                    onClick={() => handlePlace(deco.id)}
                  >
                    <span className="deco-item-emoji">{deco.emoji}</span>
                    <span className="deco-item-name">{deco.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="deco-inventory">
            <p className="inventory-label">보유 소품</p>
            <div className="inventory-grid">
              {availableDecos.map(deco => (
                <div key={deco.id} className="inventory-item">
                  <span>{deco.emoji}</span>
                  <span className="inventory-name">{deco.name}</span>
                </div>
              ))}
              {availableDecos.length === 0 && (
                <p className="inventory-empty">손님을 잘 만족시키면 소품을 얻을 수 있어요!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

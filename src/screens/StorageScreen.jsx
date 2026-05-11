import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DECORATIONS } from '../data/decorations';
import './StorageScreen.css';

function LetterCard({ letter, onOpen }) {
  return (
    <button
      className={`letter-card ${!letter.read ? 'unread' : ''}`}
      onClick={() => onOpen(letter)}
    >
      <div className="letter-envelope">
        <div className="envelope-icon">
          {letter.read ? '📩' : '💌'}
        </div>
        <div className="letter-preview">
          <div className="letter-from-row">
            <span className="letter-avatar">{letter.avatar}</span>
            <span className="letter-from">{letter.from}님으로부터</span>
            {!letter.read && <span className="unread-dot" />}
          </div>
          <p className="letter-snippet">{letter.text.slice(0, 35)}…</p>
          <span className="letter-date">{letter.date}</span>
        </div>
      </div>
    </button>
  );
}

function LetterModal({ letter, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet letter-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="letter-modal-header">
          <div className="letter-modal-avatar" style={{ background: letter.avatarBg }}>
            <span>{letter.avatar}</span>
          </div>
          <div>
            <p className="letter-modal-from">{letter.from}님의 편지</p>
            <p className="letter-modal-date">{letter.date}</p>
          </div>
        </div>

        <div className="letter-modal-body">
          <div className="letter-paper">
            <div className="letter-paper-lines" />
            <p className="letter-text">{letter.text}</p>
          </div>
        </div>

        <button className="btn-secondary" onClick={onClose}>
          편지 접기
        </button>
      </div>
    </div>
  );
}

export default function StorageScreen() {
  const { state, dispatch } = useGame();
  const { letters, unlockedDecorationIds, coins } = state;
  const [activeTab, setActiveTab] = useState('letters');
  const [selectedLetter, setSelectedLetter] = useState(null);

  const lockedDecos = DECORATIONS.filter(d => !unlockedDecorationIds.includes(d.id));
  const unlockedDecos = DECORATIONS.filter(d => unlockedDecorationIds.includes(d.id));
  const unreadCount = letters.filter(l => !l.read).length;

  function handleOpenLetter(letter) {
    setSelectedLetter(letter);
    if (!letter.read) {
      dispatch({ type: 'MARK_LETTER_READ', payload: letter.id });
    }
  }

  function handleBuyDeco(decoId) {
    dispatch({ type: 'BUY_DECORATION', payload: { decoId } });
  }

  const TYPE_LABEL = { floor: '바닥', wall: '벽', shelf: '선반', counter: '카운터' };

  return (
    <div className="storage-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => dispatch({ type: 'GO_SCREEN', payload: 'main' })}>
          ←
        </button>
        <span className="screen-title">보관함</span>
        <div className="storage-coins">
          <span>🪙</span>
          <span>{coins}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="storage-tabs">
        <button
          className={`storage-tab ${activeTab === 'letters' ? 'active' : ''}`}
          onClick={() => setActiveTab('letters')}
        >
          💌 편지함
          {unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
        </button>
        <button
          className={`storage-tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          🎁 소품
        </button>
      </div>

      <div className="scroll-area">
        {/* Letters tab */}
        {activeTab === 'letters' && (
          <div className="letters-section">
            {letters.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p className="empty-title">아직 편지가 없어요</p>
                <p className="empty-sub">
                  손님을 아주 만족시키면<br />감사 편지를 받을 수 있어요 💌
                </p>
              </div>
            ) : (
              <div className="letters-list">
                {letters.map(letter => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    onOpen={handleOpenLetter}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Items tab */}
        {activeTab === 'items' && (
          <div className="items-section">
            {/* 보유 소품 */}
            <p className="items-section-label">보유 중 ({unlockedDecos.length}개)</p>
            <div className="items-grid">
              {unlockedDecos.map(deco => (
                <div key={deco.id} className="item-card">
                  <span className="item-emoji">{deco.emoji}</span>
                  <p className="item-name">{deco.name}</p>
                  <p className="item-type-tag">{TYPE_LABEL[deco.type]}</p>
                </div>
              ))}
            </div>

            {/* 구매 가능한 소품 */}
            {lockedDecos.length > 0 && (
              <>
                <p className="items-section-label">구매 가능 ({lockedDecos.length}개)</p>
                <div className="shop-list">
                  {lockedDecos.map(deco => {
                    const canAfford = coins >= deco.price;
                    return (
                      <div key={deco.id} className="shop-item-card">
                        <div className="shop-item-emoji-wrap">
                          <span className="shop-item-emoji">{deco.emoji}</span>
                        </div>
                        <div className="shop-item-info">
                          <p className="shop-item-name">{deco.name}</p>
                          <p className="shop-item-desc">{deco.description}</p>
                          <span className="shop-item-type">{TYPE_LABEL[deco.type]} 소품</span>
                        </div>
                        <button
                          className={`shop-buy-btn ${!canAfford ? 'shop-buy-disabled' : ''}`}
                          onClick={() => canAfford && handleBuyDeco(deco.id)}
                          disabled={!canAfford}
                        >
                          <span className="shop-buy-price">🪙{deco.price}</span>
                          <span className="shop-buy-label">{canAfford ? '구매' : '부족'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {lockedDecos.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <p className="empty-title">소품을 모두 모았어요!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Letter modal */}
      {selectedLetter && (
        <LetterModal
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
        />
      )}
    </div>
  );
}

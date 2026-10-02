import React from 'react';

export default function CardDetails({ card, onClose }) {
  if (!card) return null;

  return (
    <div style={styles.panel}>
      <button style={styles.closeBtn} onClick={onClose}>✕</button>
      <h2>{card.name}</h2>
      <p><strong>Type :</strong> {card.type}</p>
      <p><strong>Race :</strong> {card.race} {card.attribute && `| ${card.attribute}`}</p>
      {card.atk !== undefined && (
        <p><strong>ATK :</strong> {card.atk} / <strong>DEF :</strong> {card.def}</p>
      )}
      {card.level && <p><strong>Niveau / Rang :</strong> ⭐ {card.level}</p>}
      <hr style={{ margin: '12px 0', borderColor: '#444' }} />
      <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{card.desc}</p>
    </div>
  );
}

const styles = {
  panel: {
    position: 'absolute',
    right: 20,
    top: 20,
    bottom: 20,
    width: '320px',
    backgroundColor: 'rgba(20, 20, 25, 0.9)',
    color: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
    overflowY: 'auto',
    zIndex: 10,
  },
  closeBtn: {
    float: 'right',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
  }
};
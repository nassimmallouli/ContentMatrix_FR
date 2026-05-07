import React, { useMemo, useState } from 'react';
import { TYPES, DOMAINS } from '../lib/config.js';

function heatClass(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  if (count === 4) return 4;
  return 5;
}

const HEAT_BG = ['', '#fff5f2', '#ffede8', '#ffd6cc', '#ffb09c', '#e8562a'];
const HEAT_FG = ['', 'var(--ink)', 'var(--ink)', 'var(--ink)', 'var(--ink)', '#fff'];

export function MatrixView({ docs, onCellClick, onCellDrop, uploading }) {
  const [dragOver, setDragOver] = useState(null); // 'type-domain'

  const matrix = useMemo(() => {
    const m = {};
    for (const type of TYPES) {
      m[type.id] = {};
      for (const domain of DOMAINS) {
        m[type.id][domain.id] = docs.filter(d => d.type === type.id && d.domain === domain.id);
      }
    }
    return m;
  }, [docs]);

  // Group domains
  const metier = DOMAINS.filter(d => d.group === 'metier');
  const it = DOMAINS.filter(d => d.group === 'it');

  const handleDragOver = (e, typeId, domainId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(`${typeId}-${domainId}`);
  };
  const handleDragLeave = () => setDragOver(null);
  const handleDrop = (e, typeId, domainId) => {
    e.preventDefault();
    setDragOver(null);
    const files = [...(e.dataTransfer.files || [])];
    if (files.length) onCellDrop(files[0], typeId, domainId);
  };

  // Grid: 1 label col + 3 metier + 1 spacer + 4 it
  const gridCols = `200px repeat(3, minmax(140px,1fr)) 16px repeat(4, minmax(140px,1fr))`;

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, minWidth: 1200 }}>

          {/* ── Row 1: group labels ── */}
          <div style={cornerCell} />
          <div style={{ ...groupLabel, color: 'var(--violet)', gridColumn: 'span 3', borderRight: '1px solid var(--border-soft)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>⬡ Domaines Métier</span>
          </div>
          <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }} />
          <div style={{ ...groupLabel, color: 'var(--cyan)', gridColumn: 'span 4' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>⬡ Domaines Technique / IT</span>
          </div>

          {/* ── Row 2: domain headers ── */}
          <div style={{ ...cornerCell, borderTop: '1px solid var(--border-soft)', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--ink-mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Type ↓ · Domaine →
            </span>
          </div>
          {[...metier, null, ...it].map((domain, i) => {
            if (domain === null) return (
              <div key="spacer" style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }} />
            );
            const count = docs.filter(d => d.domain === domain.id).length;
            return (
              <div key={domain.id} style={{
                background: '#fff', borderRight: '1px solid var(--border-soft)',
                borderBottom: '1px solid var(--border)', padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: domain.color, flexShrink: 0, display: 'block' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.84rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ink)' }}>{domain.label}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--bg-alt)', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>{count}</span>
              </div>
            );
          })}

          {/* ── Data rows: one per type ── */}
          {TYPES.map(type => (
            <React.Fragment key={type.id}>
              {/* Row label */}
              <div style={{
                background: '#fff', borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border-soft)', padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--bg-alt)', display: 'grid', placeItems: 'center',
                  fontSize: '1.1rem', flexShrink: 0, boxShadow: 'var(--shadow-xs)',
                }}>{type.icon}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.92rem', color: 'var(--ink)' }}>{type.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{type.hint}</div>
                </div>
              </div>

              {/* Cells: metier domains */}
              {metier.map(domain => (
                <Cell key={domain.id} type={type} domain={domain}
                  items={matrix[type.id]?.[domain.id] || []}
                  isOver={dragOver === `${type.id}-${domain.id}`}
                  onClick={() => onCellClick(type.id, domain.id)}
                  onDragOver={e => handleDragOver(e, type.id, domain.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, type.id, domain.id)}
                />
              ))}

              {/* Column spacer */}
              <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border-soft)' }} />

              {/* Cells: IT domains */}
              {it.map(domain => (
                <Cell key={domain.id} type={type} domain={domain}
                  items={matrix[type.id]?.[domain.id] || []}
                  isOver={dragOver === `${type.id}-${domain.id}`}
                  onClick={() => onCellClick(type.id, domain.id)}
                  onDragOver={e => handleDragOver(e, type.id, domain.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, type.id, domain.id)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid var(--border-soft)',
        background: 'var(--bg-alt)', display: 'flex', gap: 16, alignItems: 'center',
        fontSize: '0.78rem', color: 'var(--ink-soft)', flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 700 }}>Densité de contenu :</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ width: 20, height: 12, background: 'repeating-linear-gradient(45deg,#fff,#fff 3px,#fafaf8 3px,#fafaf8 6px)', border: '1px solid var(--border)', borderRadius: 3 }} />
          <span style={{ margin: '0 4px', fontWeight: 600 }}>0</span>
          {HEAT_BG.slice(1).map((bg, i) => (
            <div key={i} style={{ width: 20, height: 12, background: bg, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }} />
          ))}
          <span style={{ marginLeft: 4, fontWeight: 600 }}>5+</span>
        </div>
        <span style={{ marginLeft: 'auto', opacity: 0.7, fontWeight: 500 }}>💡 Glisser-déposer un fichier dans une cellule · Cliquer pour explorer</span>
      </div>
    </div>
  );
}

function Cell({ type, domain, items, isOver, onClick, onDragOver, onDragLeave, onDrop }) {
  const count = items.length;
  const heat = heatClass(count);
  const bg = isOver ? '#ffece8' : heat === 0
    ? 'repeating-linear-gradient(45deg,#fff,#fff 4px,#fafaf8 4px,#fafaf8 8px)'
    : HEAT_BG[heat];
  const fg = HEAT_FG[heat];

  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        padding: 10,
        borderRight: '1px solid var(--border-soft)',
        borderBottom: '1px solid var(--border-soft)',
        background: bg,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: 100,
        display: 'flex', flexDirection: 'column', gap: 6,
        position: 'relative',
        boxShadow: isOver ? 'inset 0 0 0 2px var(--accent)' : 'none',
      }}
      className="matrix-cell"
    >
      {isOver && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)',
          display: 'grid', placeItems: 'center', fontWeight: 800,
          color: 'var(--accent)', fontSize: '0.84rem', borderRadius: 4,
          pointerEvents: 'none', zIndex: 10, backdropFilter: 'blur(2px)'
        }}>↓ Déposer ici</div>
      )}
      
      {!isOver && (
        <div className="hover-overlay">
          <span>+ Glisser un fichier</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: fg === '#fff' ? 'rgba(255,255,255,0.85)' : 'var(--ink-mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        <span>{type.label}</span>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: domain.color, display: 'block' }} />
      </div>
      
      <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.04em', lineHeight: 1, color: fg === '#fff' ? '#fff' : count === 0 ? 'var(--border)' : 'var(--ink)' }}>
        {count || '—'}
      </div>
      
      {count > 0 && (
        <div style={{ fontSize: '0.72rem', color: fg === '#fff' ? 'rgba(255,255,255,0.9)' : 'var(--ink-soft)', marginTop: 'auto', fontWeight: 600, lineHeight: 1.3 }}>
          {items.slice(0, 2).map(d => (
            <div key={d.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {d.title}</div>
          ))}
          {items.length > 2 && <div style={{ opacity: 0.6, fontSize: '0.65rem' }}>+{items.length - 2} autres</div>}
        </div>
      )}
    </div>
  );
}

const cornerCell = {
  background: 'var(--bg-alt)', borderRight: '1px solid var(--border)',
  borderBottom: '1px solid var(--border)', padding: '12px 16px',
  display: 'flex', alignItems: 'center',
};
const groupLabel = {
  background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)',
  padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10,
};

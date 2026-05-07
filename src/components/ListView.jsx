import React from 'react';
import { TYPES, DOMAINS, STATUS } from '../lib/config.js';

export function ListView({ docs, onView }) {
  if (docs.length === 0) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.5)', border: '2px dashed var(--border)', borderRadius: '20px', padding: '80px 20px', textAlign: 'center', color: 'var(--ink-mute)', marginBottom: 32 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📂</div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)' }}>Aucun contenu</div>
        <div style={{ fontSize: '0.9rem', marginTop: 8 }}>Ajoutez votre premier contenu via le bouton "+ Nouveau"</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginBottom: 32, boxShadow: 'var(--shadow-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
            {['Titre', 'Type', 'Domaine', 'Statut', 'Date', ''].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontWeight: 700, fontSize: '0.74rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, i) => {
            const type = TYPES.find(t => t.id === doc.type);
            const domain = DOMAINS.find(d => d.id === doc.domain);
            const status = STATUS[doc.status] || STATUS.draft;
            return (
              <tr key={doc.id} onClick={() => onView(doc)}
                style={{ cursor: 'pointer', borderBottom: i < docs.length - 1 ? '1px solid var(--border-soft)' : 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                    {doc.title}
                  </div>
                  {doc.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {doc.tags.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: '0.65rem', color: 'var(--ink-mute)', background: 'var(--bg-alt)', padding: '1px 6px', borderRadius: 4 }}>#{t}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-alt)', borderRadius: 8, fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                    {type?.icon} {type?.label}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, fontSize: '0.74rem', fontWeight: 700, background: domain?.bg, color: domain?.color }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: domain?.color }} />
                    {domain?.label}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: '0.74rem', fontWeight: 700, background: status.bg, color: status.color, border: `1px solid ${status.color}22` }}>
                    {status.label}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: 'var(--ink-mute)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {doc.created_at ? new Date(doc.created_at).toLocaleDateString('fr-FR') : '—'}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-alt)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.74rem', border: '1px solid var(--border-soft)', transition: 'all 0.2s' }}>
                    Ouvrir →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

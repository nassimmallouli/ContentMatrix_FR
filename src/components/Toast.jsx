import React from 'react';

const ICONS = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
const COLORS = {
  success: { bg: '#edf7f1', border: '#a3d4b5', color: '#2d8a4e' },
  error:   { bg: '#fef0ee', border: '#f4b8b1', color: '#c43a2c' },
  info:    { bg: '#f0f4ff', border: '#b8c5f4', color: '#3d4fb8' },
  warn:    { bg: '#fdf5e8', border: '#f0cc8a', color: '#c07d28' },
};

export function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const c = COLORS[t.type] || COLORS.info;
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px',
            background: c.bg, border: `1px solid ${c.border}`, color: c.color,
            borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            fontSize: '0.88rem', fontWeight: 600,
            animation: 'toastIn 0.2s ease',
            maxWidth: 320,
          }}>
            <span style={{ fontSize: '0.8rem' }}>{ICONS[t.type]}</span>
            <span style={{ color: '#1a1714' }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

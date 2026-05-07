import React, { useState } from "react";
import { TYPES, DOMAINS } from "../lib/config.js";

export function DomainPicker({ open, file, detectedType, onConfirm, onClose }) {
  const [domain, setDomain] = useState("");

  if (!open || !file) return null;

  const type = TYPES.find((t) => t.id === detectedType);

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modal}>
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1rem",
            }}
          >
            Choisir un domaine
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--ink-mute)",
              marginTop: 2,
            }}
          >
            Fichier : {file.name}
          </div>
        </div>

        <div
          style={{
            padding: "16px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Detected type */}
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--ink-mute)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 6,
              }}
            >
              Type détecté
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "var(--bg-alt)",
                borderRadius: 20,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {type?.icon} {type?.label}
            </span>
          </div>

          {/* Domain selector */}
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--ink-mute)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 8,
              }}
            >
              Domaine cible
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: domain === d.id ? d.color : "var(--border)",
                    background: domain === d.id ? d.bg : "#fff",
                    color: domain === d.id ? d.color : "var(--ink)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.86rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  {d.label}
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.7rem",
                      color: "var(--ink-mute)",
                      fontWeight: 400,
                    }}
                  >
                    {d.group}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px 22px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} style={ghostBtn}>
            Annuler
          </button>
          <button
            onClick={() => domain && onConfirm(detectedType, domain)}
            disabled={!domain}
            style={{ ...primaryBtn, opacity: domain ? 1 : 0.5 }}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(26,23,20,0.5)",
  backdropFilter: "blur(4px)",
  zIndex: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const modal = {
  background: "#fff",
  borderRadius: "var(--radius-lg)",
  width: "100%",
  maxWidth: 400,
  boxShadow: "var(--shadow-xl)",
  animation: "slideUp 0.2s ease",
};
const baseBtn = {
  height: 36,
  padding: "0 16px",
  borderRadius: 8,
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "0.84rem",
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "all 0.2s",
};
const ghostBtn = {
  ...baseBtn,
  background: "#fff",
  color: "var(--ink)",
  borderColor: "var(--border)",
};
const primaryBtn = { ...baseBtn, background: "var(--ink)", color: "#fff" };

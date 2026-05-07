import React from "react";
import { TYPES, DOMAINS } from "../lib/config.js";

export function TopBar({ docCount, synced, onAdd, onExport, onImport }) {
  return (
    <header
      style={{
        background: "rgba(245,244,240,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0",
        height: 64, // Explicit height for predictable sticky offsets
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          width: "100%",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "var(--ink)",
              color: "#fff",
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "0.9rem",
              letterSpacing: "-0.02em",
            }}
          >
            K
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.92rem",
                letterSpacing: "-0.01em",
              }}
            >
              Karray Group
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                fontWeight: 500,
              }}
            >
              Content Matrix
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Sync indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            background: synced ? "var(--green-soft)" : "var(--amber-soft)",
            color: synced ? "var(--green)" : "var(--amber)",
            borderRadius: 20,
            fontSize: "0.74rem",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "currentColor",
              animation: "pulse 2s infinite",
              display: "block",
            }}
          />
          {synced ? `Cloud · ${docCount} docs` : "Hors ligne"}
        </div>

        {/* Actions */}
        <button
          onClick={onExport}
          style={ghostBtn}
          title="Exporter JSON"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-alt)";
            e.currentTarget.style.borderColor = "var(--ink-mute)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          ↓ Export
        </button>
        <button
          onClick={() => document.getElementById("import-file-input").click()}
          style={ghostBtn}
          title="Importer JSON"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-alt)";
            e.currentTarget.style.borderColor = "var(--ink-mute)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          ↑ Import
        </button>
        <input
          id="import-file-input"
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={onImport}
        />
        <button
          onClick={onAdd}
          style={primaryBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(26,23,20,0.15)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,23,20,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          + Nouveau
        </button>
      </div>
    </header>
  );
}

const baseBtn = {
  height: 38,
  padding: "0 16px",
  borderRadius: 10,
  fontFamily: "var(--font-body)",
  fontWeight: 700,
  fontSize: "0.85rem",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.2s var(--ease)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  border: "1px solid transparent",
};
const ghostBtn = {
  ...baseBtn,
  background: "#fff",
  color: "var(--ink)",
  borderColor: "var(--border)",
};
const primaryBtn = {
  ...baseBtn,
  background: "var(--ink)",
  color: "#fff",
  boxShadow: "0 2px 8px rgba(26,23,20,0.1)",
};

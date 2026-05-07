import React from "react";
import { TYPES, DOMAINS } from "../lib/config.js";

export function FilterBar({
  search,
  setSearch,
  filterType,
  setFilterType,
  filterDomain,
  setFilterDomain,
  filterStatus,
  setFilterStatus,
  view,
  setView,
}) {
  const hasActiveFilters =
    search || filterType || filterDomain || filterStatus;

  const clearFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterDomain("");
    setFilterStatus("");
  };

  return (
    <div style={containerStyle}>
      {/* Search */}
      <div style={searchWrapperStyle}>
        <span style={searchIconStyle}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un titre, tag, description..."
          style={searchInputStyle}
        />
        {search && (
          <button onClick={() => setSearch("")} style={clearSearchButtonStyle}>
            ✕
          </button>
        )}
      </div>

      {/* Selects Container */}
      <div style={filtersGroupStyle}>
        <FilterSelect
          value={filterType}
          onChange={setFilterType}
          options={[{ v: "", l: "Tous les types" }, ...TYPES.map(t => ({ v: t.id, l: t.label }))]}
          icon="📁"
        />
        <FilterSelect
          value={filterDomain}
          onChange={setFilterDomain}
          options={[{ v: "", l: "Tous les domaines" }, ...DOMAINS.map(d => ({ v: d.id, l: d.label }))]}
          icon="🌐"
        />
        <FilterSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { v: "", l: "Tous statuts" },
            { v: "draft", l: "Brouillon" },
            { v: "published", l: "Publié" },
            { v: "archived", l: "Archivé" },
          ]}
          icon="●"
        />

        {hasActiveFilters && (
          <button onClick={clearFilters} style={resetButtonStyle}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* View Switcher */}
      <div style={viewSwitcherStyle}>
        {[
          { v: "matrix", icon: "▦", label: "Matrice" },
          { v: "list", icon: "☰", label: "Liste" },
          { v: "gallery", icon: "▥", label: "Galerie" },
        ].map(({ v, icon, label }) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`view-switch${view === v ? " is-active" : ""}`}
          >
            {icon} <span className="view-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options, icon }) {
  const isSelected = !!value;

  return (
    <div className="filter-select-wrapper" style={selectWrapperStyle}>
      <span style={{ ...selectIconStyle, color: isSelected ? "var(--accent)" : "var(--ink-soft)" }}>{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={isSelected ? "is-selected" : ""}
        style={selectStyle}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
      <span style={{ ...selectArrowStyle, color: isSelected ? "var(--accent)" : "var(--ink-mute)" }}>▾</span>
    </div>
  );
}

const containerStyle = {
  background: "rgba(245, 244, 240, 0.95)", // Sync with TopBar
  backdropFilter: "blur(16px)",
  border: "1px solid var(--border)",
  borderTop: "none",
  borderRadius: "0 0 16px 16px",
  padding: "10px 24px",
  marginBottom: 28,
  display: "flex",
  gap: "12px 20px",
  alignItems: "center",
  flexWrap: "wrap",
  boxShadow: "0 4px 12px rgba(26, 23, 20, 0.04)",
  position: "sticky",
  top: 64, 
  zIndex: 40,
  transition: "all 0.2s ease",
};

const searchWrapperStyle = {
  position: "relative",
  flex: "1 1 300px",
  maxWidth: 420,
  display: "flex",
  alignItems: "center",
};

const searchIconStyle = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.5,
  fontSize: "0.9rem",
  pointerEvents: "none",
};

const searchInputStyle = {
  width: "100%",
  height: 38,
  padding: "0 38px 0 38px",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  background: "#fff",
  fontSize: "0.88rem",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  outline: "none",
  boxShadow: "var(--shadow-xs)",
};

const clearSearchButtonStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "rgba(26, 23, 20, 0.1)",
  color: "var(--ink-soft)",
  fontSize: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  border: "none",
};

const filtersGroupStyle = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};

const selectWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const selectIconStyle = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "0.9rem",
  pointerEvents: "none",
  transition: "all 0.2s",
  zIndex: 1,
};

const selectStyle = {
  height: 38,
  padding: "0 28px 0 32px",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: "0.84rem",
  fontWeight: 600,
  background: "#fff",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  appearance: "none",
  transition: "all 0.2s var(--ease)",
  minWidth: 140,
  outline: "none",
  color: "var(--ink-soft)",
  boxShadow: "var(--shadow-xs)",
};

const selectArrowStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "0.75rem",
  pointerEvents: "none",
};

const resetButtonStyle = {
  fontSize: "0.86rem",
  color: "var(--red)",
  fontWeight: 600,
  padding: "6px 12px",
  cursor: "pointer",
  transition: "all 0.2s",
  background: "var(--red-soft)",
  border: "none",
  borderRadius: "8px",
};

const viewSwitcherStyle = {
  marginLeft: "auto",
  display: "flex",
  gap: 2,
  background: "var(--bg-alt)",
  padding: 4,
  borderRadius: 12,
};


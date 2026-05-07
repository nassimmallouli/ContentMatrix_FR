import React, { useMemo } from "react";
import { TYPES, DOMAINS, STATUS } from "../lib/config.js";

export function KPIs({ docs }) {
  const stats = useMemo(() => {
    const published = docs.filter((d) => d.status === "published").length;
    const draft = docs.filter((d) => d.status === "draft").length;
    const types = new Set(docs.map((d) => d.type)).size;
    const domains = new Set(docs.map((d) => d.domain)).size;
    return { total: docs.length, published, draft, types, domains };
  }, [docs]);

  const icons = {
    total: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    published: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    draft: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    domains: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
  };

  const cards = [
    {
      label: "Total Contenus",
      value: stats.total,
      sub: `${stats.types} types · ${stats.domains} domaines`,
      icon: icons.total,
      iconBg: "linear-gradient(135deg, #1a1714, #4a4540)",
      iconColor: "#fff",
    },
    {
      label: "Publiés",
      value: stats.published,
      sub: `${stats.total ? Math.round((stats.published / stats.total) * 100) : 0}% du catalogue`,
      icon: icons.published,
      color: "var(--green)",
      iconBg: "linear-gradient(135deg, #2d8a4e, #1f5a36)",
      iconColor: "#fff",
    },
    {
      label: "Brouillons",
      value: stats.draft,
      sub: "En attente",
      icon: icons.draft,
      color: "var(--amber)",
      iconBg: "linear-gradient(135deg, #c07d28, #8a5820)",
      iconColor: "#fff",
    },
    {
      label: "Domaines",
      value: stats.domains,
      sub: `sur ${DOMAINS.length} actifs`,
      icon: icons.domains,
      color: "var(--indigo)",
      iconBg: "linear-gradient(135deg, #3d4fb8, #2d3a7a)",
      iconColor: "#fff",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "var(--shadow-sm)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.borderColor = "var(--border-soft)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {/* Decorative Back Icon */}
          <div
            style={{
              position: "absolute",
              right: -10,
              bottom: -10,
              opacity: 0.03,
              transform: "scale(5) rotate(-15deg)",
              pointerEvents: "none",
              color: "var(--ink)",
            }}
          >
            {c.icon}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: "0.74rem",
                color: "var(--ink-mute)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {c.label}
            </div>
            {/* Icon Container */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: c.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.iconColor,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              }}
            >
              {c.icon}
            </div>
          </div>

          <div
            style={{
              fontSize: "2.6rem",
              fontWeight: 900,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "var(--ink)",
              marginBottom: 12,
            }}
          >
            {c.value}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: c.color || "var(--ink-mute)",
              }}
            />
            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--ink-soft)",
                fontWeight: 600,
              }}
            >
              {c.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

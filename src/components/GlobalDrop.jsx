import React, { useState, useEffect, useRef } from "react";
import {
  TYPES,
  DOMAINS,
  detectTypeFromFile,
  detectDomainFromName,
} from "../lib/config.js";
import { api } from "../lib/api.js";

export function GlobalDrop({ onFileDrop }) {
  const [active, setActive] = useState(false);
  const [draggedFile, setDraggedFile] = useState(null);
  const counterRef = useRef(0);

  useEffect(() => {
    const hasFiles = (e) => e.dataTransfer?.types?.includes("Files");
    const onEnter = (e) => {
      if (!hasFiles(e)) return;
      counterRef.current += 1;
      setActive(true);
      const files = [...(e.dataTransfer.files || [])];
      if (files.length) setDraggedFile(files[0]);
    };
    const onLeave = (e) => {
      if (!hasFiles(e)) return;
      counterRef.current = Math.max(0, counterRef.current - 1);
      if (counterRef.current === 0) {
        setActive(false);
        setDraggedFile(null);
      }
    };
    const onOver = (e) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onDrop = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      counterRef.current = 0;
      setActive(false);
      setDraggedFile(null);
      if (e.target.closest?.("[data-cell]")) return; // let cell handle it
      const files = [...(e.dataTransfer.files || [])];
      if (files.length) onFileDrop(files[0]);
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("dragover", onOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [onFileDrop]);

  const getTypeInfo = () => {
    if (!draggedFile) return null;
    const detectedType = detectTypeFromFile(draggedFile);
    return TYPES.find((t) => t.id === detectedType);
  };

  const typeInfo = getTypeInfo();

  if (!active) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,23,20,0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 60px",
          textAlign: "center",
          border: "2px dashed var(--border)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>
          {typeInfo?.icon || "⬇"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.3rem",
            marginBottom: 6,
          }}
        >
          {typeInfo ? `Détecté: ${typeInfo.label}` : "Déposez votre fichier"}
        </div>
        <div style={{ color: "var(--ink-mute)", fontSize: "0.9rem" }}>
          {draggedFile?.name
            ? `📄 ${draggedFile.name}`
            : "Le type sera détecté automatiquement"}
        </div>
      </div>
    </div>
  );
}

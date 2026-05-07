import React, { useState, useEffect } from "react";
import { TYPES, DOMAINS, STATUS, detectTypeFromFile } from "../lib/config.js";
import { api } from "../lib/api.js";

const initialForm = {
  title: "",
  description: "",
  type: "",
  domain: "",
  tags: "",
  status: "draft",
  input_mode: "text",
  content: "",
  url: "",
};

export function DocForm({ open, doc, prefill, onSave, onClose, toast }) {
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const isEdit = !!doc;

  useEffect(() => {
    if (!open) return;
    if (doc) {
      setForm({
        title: doc.title || "",
        description: doc.description || "",
        type: doc.type || "",
        domain: doc.domain || "",
        tags: (doc.tags || []).join(", "),
        status: doc.status || "draft",
        input_mode: doc.input_mode || "text",
        content: doc.content || "",
        url: doc.url || "",
      });
    } else if (prefill) {
      setForm((f) => ({ ...initialForm, ...prefill }));
    } else {
      setForm(initialForm);
    }
    setFile(null);
    setFilePreview(null);
  }, [open, doc, prefill]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadFileArtifacts = (selectedFile) => {
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }

    if (
      selectedFile.type === "text/html" ||
      selectedFile.type === "text/plain" ||
      selectedFile.name.endsWith(".md") ||
      selectedFile.name.endsWith(".html") ||
      selectedFile.name.endsWith(".htm")
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => set("content", ev.target.result);
      reader.readAsText(selectedFile);
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const detectedType = detectTypeFromFile(f);
    if (!form.type) set("type", detectedType);
    if (!form.title) set("title", f.name.replace(/\.[^.]+$/, ""));
    set("input_mode", "file");
    loadFileArtifacts(f);
  };

  useEffect(() => {
    if (!open || !prefill?.file) return;
    setFile(prefill.file);
    loadFileArtifacts(prefill.file);
  }, [open, prefill]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast("Le titre est requis", "error");
    if (!form.type) return toast("Choisissez un type", "error");
    if (!form.domain) return toast("Choisissez un domaine", "error");
    // Require content according to selected source
    if (form.input_mode === "text" && !form.content.trim())
      return toast("Le contenu est requis", "error");
    if (form.input_mode === "url" && !form.url.trim())
      return toast("L'URL est requise", "error");
    if (form.input_mode === "file" && !file && !isEdit)
      return toast("Veuillez fournir un fichier", "error");

    let extra = {};
    if (file && form.input_mode === "file") {
      try {
        setUploading(true);
        const uploaded = await api.uploadFile(file);
        extra = {
          url: uploaded.url,
          storage_path: uploaded.storage_path,
          file_name: uploaded.file_name,
          file_mime: uploaded.file_mime,
          input_mode: "file",
        };
      } catch (e) {
        toast("Erreur upload: " + e.message, "error");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      domain: form.domain,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
      input_mode: form.input_mode,
      content: form.content || null,
      url: form.input_mode === "url" ? form.url : extra.url || form.url || null,
      ...extra,
    };

    onSave(payload);
  };

  if (!open) return null;

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modal}>
        {/* Head */}
        <div style={modalHead}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "1.4rem",
                letterSpacing: "-0.04em",
                color: "var(--ink)",
              }}
            >
              {isEdit ? "✎ Modifier" : "+ Nouveau Contenu"}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--ink-soft)",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {isEdit
                ? "Mise à jour des métadonnées et fichiers"
                : "Centralisez un nouvel actif dans votre matrice"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              color: "var(--ink-mute)",
              fontSize: "1.1rem",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.2s var(--ease)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--red)";
              e.currentTarget.style.color = "var(--red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--ink-mute)";
            }}
          >
            ×
          </button>
        </div>

        <div style={bodyGrid}>
          <div style={mainColumn}>
            <section style={panel}>
              <label style={labelStyle}>Titre de l'actif *</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ex: Guide Stratégique 2026"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </section>

            <section style={panel}>
              <label style={labelStyle}>Description / Notes</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Précisez l'usage ou le contexte..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  height: "auto",
                  padding: "12px 14px",
                  lineHeight: 1.6,
                  minHeight: 100,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </section>

            <section style={{ ...panel, paddingBottom: 20 }}>
              <div style={sectionTitle}>Source du Contenu</div>
              <div style={modeRow}>
                {[
                  { v: "text", l: "✏ Texte / Code", icon: "📝" },
                  { v: "url", l: "🔗 Lien URL", icon: "🌐" },
                  { v: "file", l: "📎 Fichier local", icon: "📁" },
                ].map(({ v, l, icon }) => (
                  <button
                    key={v}
                    onClick={() => set("input_mode", v)}
                    style={{
                      ...modeBtn,
                      borderColor:
                        form.input_mode === v
                          ? "var(--accent)"
                          : "var(--border)",
                      background:
                        form.input_mode === v ? "var(--accent-soft)" : "#fff",
                      color:
                        form.input_mode === v
                          ? "var(--accent)"
                          : "var(--ink-soft)",
                      boxShadow:
                        form.input_mode === v ? "var(--shadow-xs)" : "none",
                      fontWeight: 700,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {form.input_mode === "text" && (
                <textarea
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Collez ici votre texte, code HTML ou Markdown..."
                  rows={9}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    height: "auto",
                    padding: "16px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    minHeight: 280,
                    background: "#fafafa",
                    border: "1px solid var(--border)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.background = "#fafafa";
                  }}
                />
              )}
              {form.input_mode === "url" && (
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: 0.5,
                    }}
                  >
                    🔗
                  </span>
                  <input
                    value={form.url}
                    onChange={(e) => set("url", e.target.value)}
                    placeholder="https://votre-contenu.com/..."
                    style={{ ...inputStyle, paddingLeft: 38 }}
                    type="url"
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent)";
                      e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              )}
              {form.input_mode === "file" && (
                <div>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed var(--border)",
                      borderRadius: 12,
                      padding: "40px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: file ? "var(--green-soft)" : "var(--bg-alt)",
                      color: file ? "var(--green)" : "var(--ink-soft)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      transition: "all 0.2s var(--ease)",
                    }}
                  >
                    <span style={{ fontSize: "2rem", marginBottom: 12 }}>
                      {file ? "📄" : "☁️"}
                    </span>
                    {file
                      ? `Fichier prêt : ${file.name}`
                      : "Cliquez pour sélectionner un fichier"}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        marginTop: 6,
                        opacity: 0.7,
                      }}
                    >
                      {file ? "Cliquer pour changer" : "Ou glissez-déposez ici"}
                    </span>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFile}
                    />
                  </label>
                  {filePreview && (
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                      <img
                        src={filePreview}
                        alt="preview"
                        style={{
                          maxHeight: 200,
                          borderRadius: 12,
                          maxWidth: "100%",
                          objectFit: "contain",
                          border: "1px solid var(--border)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </section>

            <section style={panel}>
              <label style={labelStyle}>Mots-clés (Tags)</label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Séparez par des virgules..."
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                }}
              />
            </section>
          </div>

          <aside style={sideColumn}>
            <section style={sidePanel}>
              <div style={sectionTitle}>Classification Type *</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 10,
                }}
              >
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => set("type", t.id)}
                    style={{
                      ...typeCard,
                      borderColor:
                        form.type === t.id ? "var(--accent)" : "var(--border)",
                      background:
                        form.type === t.id ? "var(--accent-soft)" : "#fff",
                      color:
                        form.type === t.id
                          ? "var(--accent)"
                          : "var(--ink-soft)",
                      boxShadow:
                        form.type === t.id ? "var(--shadow-sm)" : "none",
                      transform:
                        form.type === t.id ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginBottom: 4 }}>
                      {t.icon}
                    </span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section style={sidePanel}>
              <div style={sectionTitle}>Domaine Métier *</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => set("domain", d.id)}
                    style={{
                      ...domainCard,
                      borderColor:
                        form.domain === d.id ? d.color : "var(--border)",
                      background: form.domain === d.id ? d.bg : "#fff",
                      color: form.domain === d.id ? d.color : "var(--ink-soft)",
                      boxShadow:
                        form.domain === d.id
                          ? `0 4px 12px ${d.color}15`
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: d.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "0.88rem", fontWeight: 800 }}>
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section style={sidePanel}>
              <div style={sectionTitle}>Cycle de vie</div>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                style={{
                  ...inputStyle,
                  height: 40,
                  background: "#fff",
                  fontWeight: 700,
                  color: STATUS[form.status]?.color || "var(--ink)",
                }}
              >
                {Object.entries(STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button onClick={onClose} style={ghostBtn}>
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            style={{
              ...primaryBtn,
              background: "var(--accent)",
              borderColor: "var(--accent)",
              opacity: uploading ? 0.7 : 1,
              padding: "0 32px",
            }}
          >
            {uploading
              ? "⏳ Upload en cours..."
              : isEdit
                ? "✓ Appliquer les changements"
                : "⚡ Créer l'actif"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(26,23,20,0.6)",
  backdropFilter: "blur(12px)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const modal = {
  background: "var(--bg-alt)",
  borderRadius: "24px",
  width: "100%",
  maxWidth: 1100,
  maxHeight: "94vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 30px 90px rgba(0,0,0,0.3)",
  animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  border: "1px solid var(--border)",
};
const modalHead = {
  padding: "24px 32px",
  borderBottom: "1px solid var(--border)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
};
const bodyGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.8fr) minmax(320px, 0.9fr)",
  gap: 24,
  padding: 32,
  overflowY: "auto",
  flex: 1,
};
const mainColumn = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const sideColumn = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  alignSelf: "start",
};
const panel = {
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 24,
  boxShadow: "var(--shadow-sm)",
};
const sidePanel = {
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 20,
  boxShadow: "var(--shadow-sm)",
};
const sectionTitle = {
  fontSize: "0.76rem",
  fontWeight: 900,
  color: "var(--ink-mute)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 14,
};
const modeRow = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
  flexWrap: "wrap",
};
const modeBtn = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid",
  fontFamily: "var(--font-body)",
  fontWeight: 700,
  fontSize: "0.84rem",
  cursor: "pointer",
  transition: "all 0.2s var(--ease)",
};
const typeCard = {
  minHeight: 90,
  padding: "16px 10px",
  borderRadius: 12,
  border: "1.5px solid",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
};
const domainCard = {
  padding: "14px 16px",
  borderRadius: 10,
  border: "1.5px solid",
  cursor: "pointer",
  transition: "all 0.2s var(--ease)",
  display: "flex",
  alignItems: "center",
  gap: 12,
  textAlign: "left",
};
const modalFooter = {
  padding: "20px 32px",
  borderTop: "1px solid var(--border)",
  display: "flex",
  justifyContent: "flex-end",
  gap: 16,
  background: "#fff",
};
const labelStyle = {
  display: "block",
  fontSize: "0.76rem",
  fontWeight: 900,
  color: "var(--ink-soft)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 10,
};
const inputStyle = {
  width: "100%",
  height: 44,
  padding: "0 16px",
  border: "1px solid var(--border)",
  borderRadius: 10,
  background: "#fff",
  fontSize: "0.92rem",
  transition: "all 0.2s var(--ease)",
  fontFamily: "var(--font-body)",
  outline: "none",
  fontWeight: 500,
};
const baseBtn = {
  height: 44,
  padding: "0 24px",
  borderRadius: 10,
  fontFamily: "var(--font-body)",
  fontWeight: 800,
  fontSize: "0.9rem",
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "all 0.2s var(--ease)",
};
const ghostBtn = {
  ...baseBtn,
  background: "var(--bg-alt)",
  color: "var(--ink)",
  borderColor: "var(--border)",
};
const primaryBtn = {
  ...baseBtn,
  background: "var(--ink)",
  color: "#fff",
};

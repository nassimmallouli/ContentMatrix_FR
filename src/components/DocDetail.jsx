import React from "react";
import { TYPES, DOMAINS, STATUS } from "../lib/config.js";

export function DocDetail({
  doc,
  open,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  if (!open || !doc) return null;

  const type = TYPES.find((t) => t.id === doc.type);
  const domain = DOMAINS.find((d) => d.id === doc.domain);
  const status = STATUS[doc.status] || STATUS.draft;
  const preview = getPreview(doc);

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modal}>
        {/* Head */}
        <div
          style={{
            padding: "16px 20px 14px",
            borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(255,255,255,0.96) 100%)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.05rem",
                lineHeight: 1.15,
                marginBottom: 8,
                color: "#121826",
              }}
            >
              {doc.title}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge bg={domain?.bg} color={domain?.color}>
                {domain?.label}
              </Badge>
              <Badge bg="var(--bg-alt)" color="var(--ink-soft)">
                {type?.icon} {type?.label}
              </Badge>
              <Badge bg={status.bg} color={status.color}>
                {status.label}
              </Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(255,255,255,0.92)",
              color: "#475467",
              fontSize: "1.05rem",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="doc-detail-scroll"
          style={{
            padding: "14px 18px 16px",
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            scrollbarGutter: "stable",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(100,116,139,0.55) transparent",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)",
          }}
        >
          {/* Preview */}
          <div style={previewShell}>
            {preview.kind === "image" && (
              <img src={preview.src} alt={doc.title} style={previewMedia} />
            )}

            {preview.kind === "video" && (
              <video src={preview.src} controls style={previewMedia} />
            )}

            {preview.kind === "youtube" && (
              <iframe
                src={preview.src}
                title={doc.title}
                style={previewFrame}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {preview.kind === "html" && (
              <iframe
                srcDoc={preview.srcDoc}
                src={preview.src}
                title={doc.title}
                style={previewFrame}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            )}

            {preview.kind === "text" && (
              <div style={textPreviewBox}>{preview.text}</div>
            )}

            {(preview.kind === "office" || preview.kind === "document") && (
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <iframe
                  src={preview.src}
                  title={doc.title}
                  style={previewFrame}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={openExternalBtn}
                  >
                    ↗ Ouvrir plein écran
                  </a>
                </div>
              </div>
            )}

            {preview.kind === "empty" && (
              <div style={emptyPreviewBox}>
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: 10 }}>
                    {preview.isLocal ? "🏠" : "📂"}
                  </div>
                  <div>
                    {preview.isLocal
                      ? "Aperçu impossible car vous travaillez en local (localhost). Les lecteurs Google/Microsoft ne peuvent pas accéder à vos fichiers locaux."
                      : "Aucun aperçu disponible pour ce contenu."}
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...openExternalBtn,
                        marginTop: 15,
                        display: "inline-block",
                      }}
                    >
                      ↗ Ouvrir le fichier original
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {preview.fileLabel && (
            <div style={previewFooter}>
              <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                {preview.fileLabel}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: "#fff",
                      color: "var(--ink)",
                      border: "1px solid #d1d5db",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    ↗ Ouvrir
                  </a>
                )}
                {preview.downloadUrl && (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(preview.downloadUrl);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = doc.file_name || doc.title;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        console.error("Download failed", err);
                        const link = document.createElement("a");
                        link.href = preview.downloadUrl;
                        link.target = "_blank";
                        link.download = doc.file_name || doc.title;
                        link.click();
                      }
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: "var(--ink)",
                      color: "#fff",
                      border: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ⬇ Télécharger
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Meta */}
          <div style={metaCard}>
            <Info label="Description" value={doc.description || "—"} />
            <Info
              label="URL"
              value={
                doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--indigo)", wordBreak: "break-all" }}
                  >
                    {doc.url}
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Info label="Fichier" value={doc.file_name || "—"} />
            <Info
              label="Tags"
              value={
                doc.tags?.length ? (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {doc.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "2px 8px",
                          background: "var(--bg-alt)",
                          borderRadius: 20,
                          fontSize: "0.72rem",
                          color: "var(--ink-soft)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  "—"
                )
              }
            />
            <Info
              label="Créé le"
              value={
                doc.created_at
                  ? new Date(doc.created_at).toLocaleString("fr-FR")
                  : "—"
              }
            />
            <Info
              label="Modifié le"
              value={
                doc.updated_at
                  ? new Date(doc.updated_at).toLocaleString("fr-FR")
                  : "—"
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid rgba(15, 23, 42, 0.08)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          <button onClick={() => onDelete(doc.id)} style={dangerBtn}>
            🗑 Supprimer
          </button>
          <button onClick={() => onDuplicate(doc)} style={ghostBtn}>
            ⎘ Dupliquer
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => onEdit(doc)} style={primaryBtn}>
            ✎ Modifier
          </button>
          <button onClick={onClose} style={ghostBtn}>
            Fermer
          </button>
        </div>
      </div>
      <style>{scrollbarStyles}</style>
    </div>
  );
}

function Badge({ bg, color, children }) {
  return (
    <span
      style={{
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: "0.74rem",
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {children}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <>
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.74rem",
          color: "var(--ink-mute)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          padding: "4px 0",
          alignSelf: "start",
        }}
      >
        {label}
      </div>
      <div style={{ padding: "4px 0", color: "var(--ink)" }}>{value}</div>
    </>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.56)",
  backdropFilter: "blur(10px) saturate(1.1)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
};
const modal = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 24,
  width: "100%",
  maxWidth: 1000,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 30px 80px rgba(2, 6, 23, 0.28)",
  animation: "slideUp 0.2s ease",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.6)",
  backdropFilter: "blur(18px)",
};
const baseBtn = {
  height: 38,
  padding: "0 14px",
  borderRadius: 10,
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "0.84rem",
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "all 0.2s",
};
const ghostBtn = {
  ...baseBtn,
  background: "rgba(255,255,255,0.9)",
  color: "var(--ink)",
  borderColor: "rgba(15, 23, 42, 0.10)",
};
const primaryBtn = {
  ...baseBtn,
  background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
  color: "#fff",
  boxShadow: "0 10px 18px rgba(17, 24, 39, 0.18)",
};
const dangerBtn = {
  ...baseBtn,
  background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
  color: "#b42318",
  borderColor: "#fecdd3",
};

const openExternalBtn = {
  padding: "8px 14px",
  background: "rgba(0,0,0,0.75)",
  color: "#fff",
  borderRadius: 8,
  fontSize: "0.8rem",
  fontWeight: 600,
  textDecoration: "none",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const previewShell = {
  width: "100%",
  flex: "0 0 auto",
  minHeight: 300,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
};

const previewMedia = {
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  display: "block",
  background: "#fff",
  flex: "1 1 auto",
};

const previewFrame = {
  width: "100%",
  height: "55vh",
  minHeight: 400,
  border: "none",
  display: "block",
  background: "#fff",
};

const textPreviewBox = {
  width: "100%",
  maxHeight: "none",
  overflow: "visible",
  padding: "14px 16px",
  background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
  color: "#1f2937",
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  lineHeight: 1.65,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const emptyPreviewBox = {
  minHeight: 300,
  flex: "1 1 auto",
  display: "grid",
  placeItems: "center",
  padding: "40px 20px",
  textAlign: "center",
  color: "var(--ink-mute)",
  background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
};

const previewFooter = {
  padding: "10px 14px",
  borderTop: "1px solid rgba(15, 23, 42, 0.08)",
  background: "rgba(248,250,252,0.95)",
  display: "flex",
  alignItems: "center",
  gap: 12,
  justifyContent: "space-between",
};

const metaCard = {
  display: "grid",
  gridTemplateColumns: "130px 1fr",
  gap: "8px 0",
  fontSize: "0.86rem",
  padding: 14,
  background: "rgba(248,250,252,0.9)",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
};

const scrollbarStyles = `
.doc-detail-scroll::-webkit-scrollbar { width: 10px; }
.doc-detail-scroll::-webkit-scrollbar-track { background: transparent; }
.doc-detail-scroll::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.45); border-radius: 999px; border: 3px solid transparent; background-clip: content-box; }
.doc-detail-scroll::-webkit-scrollbar-thumb:hover { background: rgba(71,85,105,0.62); border: 3px solid transparent; background-clip: content-box; }
`;

function getPreview(doc) {
  const mime = String(doc.file_mime || "").toLowerCase();
  const fileName = String(doc.file_name || doc.title || "").toLowerCase();
  const url = String(doc.url || "").trim();
  const content = String(doc.content || "").trim();
  const contentIsHtml = isHtmlContent(content);

  if (
    doc.type === "poster" ||
    doc.type === "gif" ||
    mime.startsWith("image/")
  ) {
    return {
      kind: "image",
      src: url,
      fileLabel: doc.file_name || doc.title,
      downloadUrl: url,
    };
  }

  if (doc.type === "video" || mime.startsWith("video/")) {
    const youtube = getYouTubePreview(url);
    if (youtube) {
      return {
        kind: "youtube",
        src: youtube.embed,
        fileLabel: doc.file_name || doc.title,
      };
    }

    return {
      kind: "video",
      src: url,
      fileLabel: doc.file_name || doc.title,
      downloadUrl: url,
    };
  }

  if (doc.type === "html" || contentIsHtml) {
    return {
      kind: "html",
      srcDoc: buildHtmlDocument(content),
      src: !content && url ? url : undefined,
      fileLabel: doc.file_name || doc.title,
      downloadUrl: url,
    };
  }

  const isOffice =
    url &&
    (mime.includes("word") ||
      mime.includes("document") ||
      mime.includes("excel") ||
      mime.includes("spreadsheet") ||
      mime.includes("presentation") ||
      mime.includes("powerpoint") ||
      mime.includes("officedocument") ||
      mime.includes("csv") ||
      mime.includes("oasis.opendocument") ||
      /\.(doc|docx|dot|dotx|docm|odt|xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i.test(
        fileName,
      ) ||
      /\.(doc|docx|dot|dotx|docm|odt|xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i.test(
        url.toLowerCase(),
      ));

  // Prioritize Office files (Word, Excel, PPT) if URL exists
  if (isOffice && url) {
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    const viewerUrl = buildOfficeViewerUrl(url, doc);

    if (isLocal) {
      return {
        kind: "empty",
        fileLabel: doc.file_name || doc.title,
        downloadUrl: url,
        isLocal: true,
      };
    }

    return {
      kind: "office",
      src: viewerUrl,
      fileLabel: doc.file_name || doc.title,
      downloadUrl: url,
    };
  }

  if (doc.type === "text" && content && !contentIsHtml) {
    return {
      kind: "text",
      text: content,
      fileLabel: doc.file_name || doc.title,
    };
  }

  const isPdf =
    url && (mime.includes("pdf") || /\.pdf(\?|#|$)/i.test(fileName));

  if (isPdf) {
    return {
      kind: "document",
      src: url,
      fileLabel: doc.file_name || doc.title,
      downloadUrl: url,
    };
  }

  if (content) {
    return {
      kind: "text",
      text: content,
      fileLabel: doc.file_name || doc.title,
    };
  }

  if (url) {
    return {
      kind: "document",
      src: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
      fileLabel: doc.file_name || doc.title,
      downloadUrl: url,
    };
  }

  return { kind: "empty" };
}

function buildOfficeViewerUrl(url, doc) {
  if (!url) return "";
  const fileName = String(doc?.file_name || doc?.title || "").toLowerCase();
  const mime = String(doc?.file_mime || "").toLowerCase();

  const isExcelOrPpt =
    mime.includes("excel") ||
    mime.includes("spreadsheet") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint") ||
    mime.includes("csv") ||
    mime.includes("oasis.opendocument") ||
    /\.(xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i.test(
      fileName,
    ) ||
    /\.(xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i.test(
      url.toLowerCase(),
    );

  if (isExcelOrPpt) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}&wdPrint=0&wdEmbedCode=0`;
}

function isHtmlContent(value) {
  if (!value) return false;
  return /<!doctype\s+html>|<html[\s>]|<head[\s>]|<body[\s>]|<\/?[a-z][^>]*>/i.test(
    value,
  );
}

function getYouTubePreview(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return {
    videoId,
    embed: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
  };
}

function extractYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }
  return "";
}

function buildHtmlDocument(source) {
  const s = String(source || "").trim();
  // if it already looks like a full HTML doc, use it directly
  if (/<!doctype\s+html>/i.test(s) || /<html[\s>]/i.test(s)) {
    return s;
  }
  // otherwise wrap fragment
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:8px;font-family:sans-serif;font-size:13px;background:#fff;overflow:auto;}*{box-sizing:border-box;}</style></head><body>${s}</body></html>`;
}

import React, { useState } from "react";
import { TYPES, DOMAINS, STATUS } from "../lib/config.js";

export function CellExplorer({
  open,
  typeId,
  domainId,
  docs,
  onClose,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onDrop,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateOrder, setDateOrder] = useState("desc");
  const [isOver, setIsOver] = useState(false);

  if (!open) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && onDrop) {
      onDrop(file, typeId, domainId);
    }
    e.target.value = "";
  };

  const triggerFileInput = () => {
    document.getElementById("cell-file-input")?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onDrop) {
      onDrop(file, typeId, domainId);
    }
  };

  const type = TYPES.find((t) => t.id === typeId);
  const domain = DOMAINS.find((d) => d.id === domainId);

  let filtered = docs.filter((d) => d.type === typeId && d.domain === domainId);
  if (search)
    filtered = filtered.filter(
      (d) =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.tags || []).some((t) => t.includes(search)),
    );
  if (statusFilter)
    filtered = filtered.filter((d) => d.status === statusFilter);
  filtered = [...filtered].sort((a, b) => {
    const da = new Date(a.created_at || a.updated_at || 0).getTime();
    const db = new Date(b.created_at || b.updated_at || 0).getTime();
    return dateOrder === "asc" ? da - db : db - da;
  });

  const domainGroupLabel =
    domain?.group === "it" ? "Domaine IT" : "Domaine Métier";

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modal}>
        <div style={header}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.05rem",
                lineHeight: 1.08,
              }}
            >
              {type?.label} × {domain?.label}
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: "0.8rem",
                color: "var(--ink-mute)",
              }}
            >
              Intersection
            </div>
          </div>
          <button onClick={onClose} style={closeBtn}>
            ×
          </button>
        </div>

        <div
          style={{
            ...hero,
            cursor: "pointer",
            transition: "background 0.2s",
            background: isOver ? "#e0e7ff" : hero.background,
          }}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Cliquez ou glissez un fichier pour importer dans cette cellule"
        >
          <input
            id="cell-file-input"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#eef4fb",
                color: "#2f67cc",
                padding: "5px 10px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: "0.9rem",
                border: "1px solid #dce7f7",
              }}
            >
              {type?.icon} {type?.label}
            </span>
            <span
              style={{
                color: "#9aa3b1",
                fontWeight: 700,
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
            >
              ×
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: domain?.bg || "#edf7f1",
                color: domain?.color || "#2d8a4e",
                padding: "5px 10px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: "0.9rem",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              {domain?.label}
            </span>
          </div>
          <div
            style={{
              marginTop: 8,
              color: isOver ? "var(--accent)" : "var(--ink-soft)",
              fontSize: "0.86rem",
              fontWeight: isOver ? 700 : 400,
            }}
          >
            {isOver ? (
              "Lâcher pour importer ici"
            ) : (
              <>
                {type?.hint} · {domainGroupLabel} · 💡 Cliquez ou glissez un
                fichier ici
              </>
            )}
          </div>
        </div>

        <div style={toolbar}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans cette cellule..."
            style={searchInput}
          />
          <select
            value={dateOrder}
            onChange={(e) => setDateOrder(e.target.value)}
            style={selectStyle}
          >
            <option value="desc">Date ↓</option>
            <option value="asc">Date ↑</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: 150 }}
          >
            <option value="">Tous statuts</option>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            ...contentArea,
            position: "relative",
            background: isOver
              ? "rgba(79, 70, 229, 0.05)"
              : contentArea.background,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isOver && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(2px)",
                border: "2px dashed var(--accent)",
                margin: 10,
                borderRadius: 12,
                color: "var(--accent)",
                fontWeight: 800,
                fontSize: "1.2rem",
              }}
            >
              Déposer pour importer
            </div>
          )}
          {filtered.length === 0 ? (
            <div
              onClick={triggerFileInput}
              style={{
                padding: "46px 24px",
                textAlign: "center",
                color: "var(--ink-mute)",
                background: "#fff",
                border: "1px dashed var(--border)",
                borderRadius: 16,
                boxShadow: "0 8px 22px rgba(26,23,20,0.04)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--bg-alt)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "#fff";
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>📭</div>
              <div style={{ fontWeight: 600 }}>Aucun contenu</div>
              <div style={{ fontSize: "0.82rem", marginTop: 4 }}>
                Cliquez ou glissez un fichier pour importer ici
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
                gap: 16,
                alignContent: "start",
              }}
            >
              {filtered.map((doc) => {
                const st = STATUS[doc.status] || STATUS.draft;
                const dateLabel = formatDateLabel(
                  doc.created_at || doc.updated_at,
                );

                return (
                  <article
                    key={doc.id}
                    style={{ ...card, position: "relative" }}
                    onClick={() => {
                      onClose();
                      onView(doc);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                      e.currentTarget.style.borderColor = "#d7dde6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <div style={previewBox}>
                      <PreviewMedia doc={doc} />
                    </div>

                    {/* thumbnail button top-right */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onView(doc);
                      }}
                      title="Ouvrir les détails"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,255,255,0.95)",
                        boxShadow: "0 6px 18px rgba(12,14,20,0.12)",
                        cursor: "pointer",
                        zIndex: 30,
                        fontSize: "1.05rem",
                      }}
                    >
                      🔍
                    </div>

                    <div
                      style={{ padding: "12px 14px 10px", background: "#fff" }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "1.05rem",
                          color: "#1f2430",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {doc.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 8,
                          color: "#8c98ab",
                          fontSize: "0.96rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "2px 10px",
                            borderRadius: 999,
                            background: st.bg,
                            color: st.color,
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: st.color,
                              opacity: 0.75,
                            }}
                          />
                          {st.label}
                        </span>
                        <span>· {dateLabel}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div style={footer}>
          <button
            onClick={onClose}
            style={{
              height: 42,
              padding: "0 24px",
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #d4dbe4",
              color: "#2f3a48",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.96rem",
              cursor: "pointer",
            }}
          >
            Fermer
          </button>
          <button
            onClick={triggerFileInput}
            style={{
              height: 42,
              padding: "0 20px",
              borderRadius: 12,
              background: "#fff",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.96rem",
              cursor: "pointer",
            }}
          >
            ↑ Importer un fichier
          </button>
          <button
            onClick={() => {
              onClose();
              onAdd({ type: typeId, domain: domainId });
            }}
            style={{
              height: 42,
              padding: "0 22px",
              borderRadius: 12,
              background: "var(--ink)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.96rem",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(26,23,20,0.22)",
            }}
          >
            + Ajouter manuellement
          </button>
        </div>
      </div>
    </div>
  );
}

function getPreviewText(doc) {
  if (doc.content && String(doc.content).trim()) {
    const text = normalizePreviewText(doc.content);
    if (text) return text;
  }
  if (doc.description && String(doc.description).trim())
    return String(doc.description).slice(0, 170);
  if (doc.tags && doc.tags.length > 0)
    return `🏷️  ${doc.tags.slice(0, 5).join(", ")}`;
  return "📝 Cliquez pour voir les détails";
}

function normalizePreviewText(value) {
  const text = String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";

  return text.length > 170 ? `${text.slice(0, 167)}...` : text;
}

function PreviewMedia({ doc }) {
  const kind = getPreviewKind(doc);

  if (kind === "html") return <HtmlPreview doc={doc} />;
  if (kind === "image") return <ImagePreview doc={doc} />;
  if (kind === "video") return <VideoPreview doc={doc} />;
  if (kind === "pdf") return <PdfPreview doc={doc} />;
  if (kind === "text") return <TextPreview doc={doc} />;

  return <FallbackPreview doc={doc} />;
}

function ImagePreview({ doc }) {
  const [failed, setFailed] = useState(false);
  const src = doc.url || doc.content || "";

  if (failed || !src) return <FallbackPreview doc={doc} />;

  return (
    <img
      src={src}
      alt={doc.title}
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        background: "#eef3f8",
      }}
    />
  );
}

function VideoPreview({ doc }) {
  const src = doc.url || "";
  if (!src) return <FallbackPreview doc={doc} />;

  const youtube = getYouTubePreview(src);
  if (youtube) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#111",
        }}
      >
        <img
          src={youtube.thumbnail}
          alt={doc.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.35))",
            color: "#fff",
            fontSize: "3rem",
            textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }}
        >
          ▶
        </div>
      </div>
    );
  }

  return (
    <video
      src={src}
      controls
      muted
      playsInline
      preload="metadata"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        background: "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)",
        display: "block",
      }}
    />
  );
}

function getYouTubePreview(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return {
    videoId,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
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

function PdfPreview({ doc }) {
  const src = doc.url || "";
  if (!src) return <FallbackPreview doc={doc} />;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#fff",
        pointerEvents: "none",
      }}
    >
      <iframe
        src={src}
        title={doc.title}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}

function HtmlPreview({ doc }) {
  const [failed, setFailed] = useState(false);
  const raw = String(doc.content || "").trim();
  const fileUrl = String(doc.url || "").trim();

  const source = raw
    ? buildHtmlPreviewDocument(decodeHtmlEntities(raw), fileUrl)
    : "";
  const src = source ? undefined : fileUrl;

  if (failed || (!source && !src)) return <FallbackPreview doc={doc} />;

  return (
    <div style={htmlShell}>
      <iframe
        key={`html-${doc.id}`}
        title={doc.title}
        src={src || undefined}
        srcDoc={source || undefined}
        sandbox="allow-scripts allow-same-origin allow-popups"
        scrolling="no"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          pointerEvents: "none",
        }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function TextPreview({ doc }) {
  const isOffice =
    doc.url &&
    (doc.file_mime?.includes("word") ||
      doc.file_mime?.includes("document") ||
      doc.file_mime?.includes("excel") ||
      doc.file_mime?.includes("spreadsheet") ||
      doc.file_mime?.includes("presentation") ||
      doc.file_mime?.includes("powerpoint") ||
      doc.file_mime?.includes("officedocument") ||
      doc.file_mime?.includes("csv") ||
      doc.file_mime?.includes("oasis.opendocument") ||
      doc.file_name?.match(
        /\.(doc|docx|dot|dotx|docm|odt|xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)$/i,
      ) ||
      doc.url?.match(
        /\.(doc|docx|dot|dotx|docm|odt|xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i,
      ));

  // If it's an Office file and we have a URL, show the iframe even if there is content
  if (isOffice && doc.url) {
    const url = doc.url;
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    const viewerUrl = buildOfficeViewerUrl(url, doc);

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#fff",
          position: "relative",
        }}
      >
        {isLocal ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 14,
              textAlign: "center",
              fontSize: "0.8rem",
              color: "var(--ink-soft)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏠</div>
            <div style={{ fontWeight: 600 }}>Aperçu impossible en local</div>
            <div style={{ fontSize: "0.74rem", marginTop: 4 }}>
              Microsoft ne peut pas accéder à votre localhost.
            </div>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{
                marginTop: 10,
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              ↗ Ouvrir le fichier
            </a>
          </div>
        ) : (
          <div
            style={{
              width: "160%",
              height: "160%",
              transform: "scale(0.625)",
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          >
            <iframe
              src={viewerUrl}
              title={doc.title}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return <div style={textPreview}>{getPreviewText(doc)}</div>;
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

function FallbackPreview({ doc }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: "var(--ink-mute)",
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        padding: 12,
      }}
    >
      <div>
        <div style={{ fontSize: "2rem", marginBottom: 6 }}>
          {TYPES.find((t) => t.id === doc.type)?.icon || "📄"}
        </div>
        <div style={{ fontSize: "0.75rem" }}>Aperçu indisponible</div>
      </div>
    </div>
  );
}

function getPreviewKind(doc) {
  const mime = String(doc.file_mime || "").toLowerCase();
  const title = String(doc.file_name || doc.title || "").toLowerCase();
  const url = String(doc.url || "").toLowerCase();
  const rawContent = String(doc.content || "").trim();
  const htmlLike = isHtmlLikeSource(rawContent);

  if (
    mime === "text/html" ||
    doc.type === "html" ||
    htmlLike ||
    /\.(html?|xhtml)(\?|#|$)/i.test(title) ||
    /\.(html?|xhtml)(\?|#|$)/i.test(url)
  ) {
    return "html";
  }

  if (
    mime.startsWith("image/") ||
    ["poster", "gif"].includes(doc.type) ||
    /\.(png|jpe?g|gif|webp|svg|bmp|tiff?|ico)(\?|#|$)/i.test(title) ||
    /\.(png|jpe?g|gif|webp|svg|bmp|tiff?|ico)(\?|#|$)/i.test(url)
  ) {
    return "image";
  }

  if (
    mime.startsWith("video/") ||
    doc.type === "video" ||
    /\.(mp4|webm|ogg|mov|mpeg|mpg|avi)(\?|#|$)/i.test(title) ||
    /\.(mp4|webm|ogg|mov|mpeg|mpg|avi)(\?|#|$)/i.test(url)
  ) {
    return "video";
  }

  if (
    mime === "application/pdf" ||
    /\.pdf(\?|#|$)/i.test(title) ||
    /\.pdf(\?|#|$)/i.test(url)
  ) {
    return "pdf";
  }

  if (
    mime.startsWith("text/") ||
    doc.type === "text" ||
    doc.type === "note" ||
    /\.(txt|md|csv|json|log|xml)(\?|#|$)/i.test(title) ||
    /\.(txt|md|csv|json|log|xml)(\?|#|$)/i.test(url) ||
    (rawContent && !htmlLike) ||
    (url &&
      (mime.includes("word") ||
        mime.includes("document") ||
        mime.includes("excel") ||
        mime.includes("spreadsheet") ||
        mime.includes("presentation") ||
        mime.includes("powerpoint") ||
        mime.includes("csv") ||
        mime.includes("oasis.opendocument") ||
        /\.(doc|docx|dot|dotx|docm|odt|xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i.test(
          title,
        ) ||
        /\.(doc|docx|dot|dotx|docm|odt|xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i.test(
          url,
        )))
  ) {
    return "text";
  }

  return "fallback";
}

function isHtmlLikeSource(source) {
  if (!source) return false;
  const decoded = decodeHtmlEntities(source);
  return /<!doctype\s+html>|<html[\s>]|<head[\s>]|<body[\s>]|<\/?[a-z][^>]*>/i.test(
    decoded,
  );
}

function decodeHtmlEntities(value) {
  if (typeof document === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function formatDateLabel(value) {
  if (!value) return "Date inconnue";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date inconnue";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function buildHtmlPreviewDocument(source, baseHref) {
  const s = String(source || "").trim();
  const resolvedBaseHref = getHtmlBaseHref(baseHref);
  const baseTag = resolvedBaseHref
    ? `<base href="${String(resolvedBaseHref).replace(/"/g, "&quot;")}">`
    : "";
  // if it already looks like a full HTML doc, use it directly
  if (/<!doctype\s+html>/i.test(s) || /<html[\s>]/i.test(s)) {
    if (!baseTag || /<base[\s>]/i.test(s)) return s;
    if (/<head[\s>]/i.test(s)) {
      return s.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
    }
    return s.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}</head>`);
  }
  // otherwise wrap fragment
  return `<!doctype html><html><head><meta charset="utf-8">${baseTag}<style>html,body{margin:0;padding:8px;font-family:sans-serif;font-size:13px;background:#fff;overflow:hidden;}*{box-sizing:border-box;}</style></head><body>${s}</body></html>`;
}

function getHtmlBaseHref(value) {
  if (!value) return "";
  try {
    return new URL(".", value).href;
  } catch {
    const clean = String(value).split("?")[0].split("#")[0];
    if (!clean) return "";
    return clean.replace(/[^/]*$/, "");
  }
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(26,23,20,0.42)",
  backdropFilter: "blur(6px)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const modal = {
  background: "#fff",
  borderRadius: 16,
  width: "100%",
  maxWidth: 1080,
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 28px 60px rgba(26,23,20,0.18)",
  animation: "slideUp 0.18s ease",
  overflow: "hidden",
};

const header = {
  padding: "18px 22px",
  borderBottom: "1px solid var(--border)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  background: "#fff",
};

const closeBtn = {
  width: 38,
  height: 38,
  borderRadius: 12,
  background: "var(--bg-alt)",
  color: "var(--ink-soft)",
  fontSize: "1.2rem",
  lineHeight: 1,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  border: "1px solid var(--border)",
};

const hero = {
  padding: "15px 22px",
  background: "#eef1f5",
  borderBottom: "1px solid #dde3ea",
};

const toolbar = {
  padding: "14px 18px",
  display: "flex",
  gap: 10,
  borderBottom: "1px solid var(--border-soft)",
  background: "#fff",
};

const searchInput = {
  flex: 1,
  height: 40,
  padding: "0 14px",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: "0.92rem",
  fontFamily: "var(--font-body)",
  background: "#fff",
};

const selectStyle = {
  height: 40,
  padding: "0 36px 0 14px",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: "0.9rem",
  fontFamily: "var(--font-body)",
  background: "#fff",
  appearance: "none",
  cursor: "pointer",
  minWidth: 120,
};

const contentArea = {
  overflowY: "auto",
  flex: 1,
  padding: "18px 18px 20px",
  background: "var(--bg)",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
};

const card = {
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "var(--shadow-xs)",
  transition: "all 0.18s var(--ease)",
  cursor: "pointer",
};

const previewBox = {
  background: "#eef3f8",
  width: "100%",
  aspectRatio: "16 / 9",
  minHeight: 160,
  maxHeight: 220,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#516070",
  lineHeight: 1.4,
  position: "relative",
  overflow: "hidden",
  borderBottom: "1px solid #e9eef3",
};

const htmlShell = {
  width: "100%",
  height: "100%",
  background: "#fff",
  position: "relative",
};

const htmlFrame = {
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
  background: "#fff",
};

const textPreview = {
  width: "100%",
  height: "100%",
  padding: "12px 14px",
  fontSize: "0.82rem",
  color: "#2c2c2c",
  lineHeight: 1.45,
  overflow: "hidden",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  background: "#fff",
  fontFamily: "var(--font-body)",
};

const footer = {
  padding: "14px 18px",
  borderTop: "1px solid var(--border)",
  background: "#eef1f5",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

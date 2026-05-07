import React, { useState } from "react";
import { TYPES, DOMAINS, STATUS } from "../lib/config.js";

export function GalleryView({ docs, onView }) {
  if (docs.length === 0) {
    return (
      <div
        style={{
          border: "2px dashed var(--border)",
          borderRadius: "20px",
          padding: "80px 20px",
          textAlign: "center",
          color: "var(--ink-mute)",
          marginBottom: 32,
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🖼️</div>
        <div
          style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--ink)" }}
        >
          Aucun contenu à afficher
        </div>
        <p style={{ fontSize: "0.9rem", marginTop: 8 }}>
          Utilisez les filtres ou ajoutez un nouveau document.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
        marginBottom: 32,
      }}
    >
      {docs.map((doc) => {
        const type = TYPES.find((t) => t.id === doc.type);
        const domain = DOMAINS.find((d) => d.id === doc.domain);
        const status = STATUS[doc.status] || STATUS.draft;
        return (
          <div
            key={doc.id}
            onClick={() => onView(doc)}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "var(--shadow-sm)",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              e.currentTarget.style.borderColor = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {/* Preview Section */}
            <div
              style={{
                height: 160,
                background: "var(--bg-alt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <PreviewMedia doc={doc} />

              {/* Type Badge Floating */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  zIndex: 10,
                }}
              >
                {type?.icon} {type?.label}
              </div>
            </div>

            {/* Content Body */}
            <div
              style={{
                padding: "16px 18px",
                background: "#fff",
                position: "relative",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  marginBottom: 10,
                  color: "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                {doc.title}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 6,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: domain?.bg,
                    color: domain?.color,
                    border: `1px solid ${domain?.color}22`,
                  }}
                >
                  {domain?.label}
                </span>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 6,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: status.bg,
                    color: status.color,
                    border: `1px solid ${status.color}22`,
                  }}
                >
                  {status.label}
                </span>
              </div>

              {doc.description ? (
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--ink-soft)",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {doc.description}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--ink-mute)",
                    fontStyle: "italic",
                  }}
                >
                  Pas de description
                </div>
              )}

              {/* Footer / Meta */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border-soft)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--ink-mute)",
                    fontWeight: 500,
                  }}
                >
                  📅{" "}
                  {doc.created_at
                    ? new Date(doc.created_at).toLocaleDateString()
                    : "—"}
                </span>
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  Détails →
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Full port of CellExplorer.jsx Preview logic
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
            fontSize: "2rem",
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

  // Browser can usually render PDF directly in iframe
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
  const raw = String(doc.content || "").trim();
  const fileUrl = String(doc.url || "").trim();

  const source = raw
    ? buildHtmlPreviewDocument(decodeHtmlEntities(raw), fileUrl)
    : "";
  const src = source ? undefined : fileUrl;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        pointerEvents: "none",
      }}
    >
      <iframe
        key={`html-gal-${doc.id}`}
        title={doc.title}
        src={src || undefined}
        srcDoc={source || undefined}
        sandbox="allow-scripts allow-same-origin"
        scrolling="no"
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

function OfficePreview({ doc }) {
  const url = doc.url || "";
  if (!url) return <FallbackPreview doc={doc} />;

  const isLocal = url.includes("localhost") || url.includes("127.0.0.1");

  const isExcelOrPpt =
    doc.file_mime?.includes("excel") ||
    doc.file_mime?.includes("spreadsheet") ||
    doc.file_mime?.includes("presentation") ||
    doc.file_mime?.includes("powerpoint") ||
    doc.file_mime?.includes("csv") ||
    doc.file_mime?.includes("oasis.opendocument") ||
    doc.file_name?.match(
      /\.(xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)$/i,
    ) ||
    doc.url?.match(
      /\.(xls|xlsx|xlsm|xlsb|xltx|csv|ods|ppt|pptx|ppsx|pptm|odp)(\?|#|$)/i,
    );

  // Use Google for Excel/PPT, Microsoft for Word
  const viewerUrl = isExcelOrPpt
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    : buildOfficeViewerUrl(url, doc);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#fff",
        pointerEvents: "none",
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
            padding: 10,
            textAlign: "center",
            fontSize: "0.7rem",
            color: "var(--ink-mute)",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>🏠</div>
          <div>Aperçu impossible en local</div>
        </div>
      ) : (
        <div
          style={{
            width: "160%",
            height: "160%",
            transform: "scale(0.625)",
            transformOrigin: "top left",
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

  if (isOffice) return <OfficePreview doc={doc} />;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "14px",
        fontSize: "0.8rem",
        color: "#334155",
        lineHeight: 1.5,
        overflow: "hidden",
        background: "#fff",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        display: "-webkit-box",
        WebkitLineClamp: 7,
        WebkitBoxOrient: "vertical",
      }}
    >
      {getPreviewText(doc)}
    </div>
  );
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
        <div style={{ fontSize: "0.7rem", fontWeight: 600 }}>
          Aperçu indisponible
        </div>
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

function buildHtmlPreviewDocument(source, baseHref) {
  const s = String(source || "").trim();
  const resolvedBaseHref = getHtmlBaseHref(baseHref);
  const baseTag = resolvedBaseHref
    ? `<base href="${String(resolvedBaseHref).replace(/"/g, "&quot;")}">`
    : "";
  if (/<!doctype\s+html>/i.test(s) || /<html[\s>]/i.test(s)) {
    if (!baseTag || /<base[\s>]/i.test(s)) return s;
    if (/<head[\s>]/i.test(s)) {
      return s.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
    }
    return s.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}</head>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8">${baseTag}<style>html,body{margin:0;padding:4px;font-family:sans-serif;font-size:11px;background:#fff;overflow:hidden;}*{box-sizing:border-box;}</style></head><body>${s}</body></html>`;
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

function getPreviewText(doc) {
  if (doc.content && String(doc.content).trim()) {
    const text = String(doc.content)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 200 ? text.slice(0, 197) + "..." : text;
  }
  if (doc.description && String(doc.description).trim())
    return String(doc.description).slice(0, 170);
  if (doc.tags && doc.tags.length > 0)
    return `🏷️  ${doc.tags.slice(0, 5).join(", ")}`;
  return "📝 Cliquez pour voir les détails";
}

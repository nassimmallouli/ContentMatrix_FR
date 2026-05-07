export const TYPES = [
  {
    id: "html",
    label: "HTML",
    icon: "🌐",
    cls: "t-html",
    hint: "Pages web, landing pages, newsletters",
  },
  {
    id: "gif",
    label: "GIF",
    icon: "🎞",
    cls: "t-gif",
    hint: "Animations courtes",
  },
  {
    id: "poster",
    label: "Affiche",
    icon: "🖼",
    cls: "t-poster",
    hint: "Visuels fixes, posts social",
  },
  {
    id: "video",
    label: "Vidéo",
    icon: "▶",
    cls: "t-video",
    hint: "Clips, tutos, replays",
  },
  {
    id: "text",
    label: "Texte",
    icon: "📝",
    cls: "t-text",
    hint: "Articles, scripts, posts",
  },
];

export const DOMAINS = [
  {
    id: "iso",
    label: "ISO",
    group: "metier",
    color: "#3d4fb8",
    bg: "#eceffe",
    keywords: ["iso", "27001", "9001", "14001"],
  },
  {
    id: "gestion",
    label: "Gestion Projet",
    group: "metier",
    color: "#1e7fa0",
    bg: "#e8f5fa",
    keywords: ["pmp", "prince2", "agile", "scrum", "kanban", "projet"],
  },
  {
    id: "transfo",
    label: "Transformation",
    group: "metier",
    color: "#6e44cc",
    bg: "#f2edfb",
    keywords: ["transformation", "digital", "change", "strategie"],
  },
  {
    id: "cyber",
    label: "Cybersécurité",
    group: "it",
    color: "#c43a2c",
    bg: "#fef0ee",
    keywords: ["cyber", "security", "pentest", "soc", "firewall"],
  },
  {
    id: "dev",
    label: "Développement",
    group: "it",
    color: "#2d8a4e",
    bg: "#edf7f1",
    keywords: ["dev", "code", "python", "java", "react", "node"],
  },
  {
    id: "data",
    label: "Data",
    group: "it",
    color: "#d4600f",
    bg: "#fef3ea",
    keywords: ["data", "sql", "bi", "powerbi", "analytics"],
  },
  {
    id: "app",
    label: "Applications",
    group: "it",
    color: "#b83a6b",
    bg: "#fcecf3",
    keywords: ["app", "mobile", "flutter", "android", "ios", "saas"],
  },
];

export const STATUS = {
  draft: { label: "Brouillon", color: "#c07d28", bg: "#fdf5e8" },
  published: { label: "Publié", color: "#2d8a4e", bg: "#edf7f1" },
  archived: { label: "Archivé", color: "#9a948c", bg: "#eeece7" },
};

export const MIME_TO_TYPE = {
  "text/html": "html",
  "image/gif": "gif",
  "image/png": "poster",
  "image/jpeg": "poster",
  "image/webp": "poster",
  "image/svg+xml": "poster",
  "image/bmp": "poster",
  "image/tiff": "poster",
  "image/x-icon": "poster",
  "video/mp4": "video",
  "video/webm": "video",
  "video/ogg": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "text/plain": "text",
  "application/pdf": "text",
  "application/msword": "text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
    "text",
  "application/vnd.ms-excel": "text",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "text",
  "application/vnd.ms-excel.sheet.macroEnabled.12": "text",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "text",
  "text/csv": "text",
  "application/csv": "text",
  "application/x-excel": "text",
  "application/x-msexcel": "text",
  "application/vnd.oasis.opendocument.spreadsheet": "text",
  "application/vnd.oasis.opendocument.text": "text",
  "application/vnd.oasis.opendocument.presentation": "text",
  "application/vnd.ms-powerpoint": "text",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "text",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "text",
};

export function detectTypeFromFile(file) {
  if (MIME_TO_TYPE[file.type]) return MIME_TO_TYPE[file.type];

  // Detect by MIME type prefix (catch all images/videos even if not in map)
  const mime = file.type.toLowerCase();
  if (mime.startsWith("image/")) {
    return mime === "image/gif" ? "gif" : "poster";
  }
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("text/")) return "text";
  if (mime.startsWith("application/")) {
    if (mime.includes("pdf")) return "text";
    if (
      mime.includes("word") ||
      mime.includes("document") ||
      mime.includes("oasis.opendocument.text")
    )
      return "text";
    if (
      mime.includes("excel") ||
      mime.includes("spreadsheet") ||
      mime.includes("ms-excel") ||
      mime.includes("csv") ||
      mime.includes("oasis.opendocument.spreadsheet")
    )
      return "text";
    if (
      mime.includes("powerpoint") ||
      mime.includes("presentation") ||
      mime.includes("oasis.opendocument.presentation")
    )
      return "text";
  }

  // Fallback to extension-based detection
  const ext = file.name.split(".").pop().toLowerCase();
  const extMap = {
    html: "html",
    htm: "html",
    gif: "gif",
    png: "poster",
    jpg: "poster",
    jpeg: "poster",
    webp: "poster",
    svg: "poster",
    bmp: "poster",
    tiff: "poster",
    tif: "poster",
    ico: "poster",
    mp4: "video",
    webm: "video",
    mov: "video",
    mpeg: "video",
    mpg: "video",
    avi: "video",
    txt: "text",
    md: "text",
    pdf: "text",
    doc: "text",
    docx: "text",
    dot: "text",
    dotx: "text",
    docm: "text",
    odt: "text",
    xls: "text",
    xlsx: "text",
    xlsm: "text",
    xlsb: "text",
    xltx: "text",
    csv: "text",
    ods: "text",
    ppt: "text",
    pptx: "text",
    ppsx: "text",
    pptm: "text",
    odp: "text",
  };
  return extMap[ext] || "text";
}

export function detectDomainFromName(name) {
  const lower = name.toLowerCase();
  for (const d of DOMAINS) {
    if (d.keywords.some((k) => lower.includes(k))) return d.id;
  }
  return null;
}

export const API_BASE = "/api";

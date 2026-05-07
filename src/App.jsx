import React, { useState, useCallback, useMemo } from "react";
import { TopBar } from "./components/TopBar.jsx";
import { KPIs } from "./components/KPIs.jsx";
import { MatrixView } from "./components/MatrixView.jsx";
import { ListView } from "./components/ListView.jsx";
import { GalleryView } from "./components/GalleryView.jsx";
import { DocForm } from "./components/DocForm.jsx";
import { DocDetail } from "./components/DocDetail.jsx";
import { CellExplorer } from "./components/CellExplorer.jsx";
import { DomainPicker } from "./components/DomainPicker.jsx";
import { GlobalDrop } from "./components/GlobalDrop.jsx";
import { FilterBar } from "./components/FilterBar.jsx";
import { ToastContainer } from "./components/Toast.jsx";
import { useDocuments } from "./hooks/useDocuments.js";
import { useToast } from "./hooks/useToast.js";
import {
  TYPES,
  DOMAINS,
  detectTypeFromFile,
  detectDomainFromName,
} from "./lib/config.js";
import { api } from "./lib/api.js";

export default function App() {
  const {
    docs,
    loading,
    synced,
    error,
    fetchAll,
    createDoc,
    updateDoc,
    deleteDoc,
  } = useDocuments();
  const { toasts, toast } = useToast();

  // View
  const [view, setView] = useState("matrix");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [formDoc, setFormDoc] = useState(null); // editing doc
  const [formPrefill, setFormPrefill] = useState({}); // prefill for new

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDoc, setDetailDoc] = useState(null);

  const [cellOpen, setCellOpen] = useState(false);
  const [cellType, setCellType] = useState("");
  const [cellDomain, setCellDomain] = useState("");

  const [uploading, setUploading] = useState(false);

  // Global drop → domain picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFile, setPickerFile] = useState(null);
  const [pickerType, setPickerType] = useState("");

  // ── Filtered docs ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (filterType && d.type !== filterType) return false;
      if (filterDomain && d.domain !== filterDomain) return false;
      if (filterStatus && d.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const inTitle = d.title?.toLowerCase().includes(q);
        const inDesc = d.description?.toLowerCase().includes(q);
        const inTags = (d.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inTags) return false;
      }
      return true;
    });
  }, [docs, filterType, filterDomain, filterStatus, search]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openAdd = (prefill = {}) => {
    setFormDoc(null);
    setFormPrefill(prefill);
    setFormOpen(true);
  };
  const openEdit = (doc) => {
    setDetailOpen(false);
    setFormDoc(doc);
    setFormPrefill({});
    setFormOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      if (formDoc) {
        await updateDoc(formDoc.id, payload);
        toast("Contenu mis à jour ✓", "success");
      } else {
        await createDoc(payload);
        toast("Contenu créé ✓", "success");
      }
      setFormOpen(false);
    } catch (e) {
      toast("Erreur: " + e.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce contenu ?")) return;
    try {
      await deleteDoc(id);
      setDetailOpen(false);
      toast("Supprimé ✓", "success");
    } catch (e) {
      toast("Erreur: " + e.message, "error");
    }
  };

  const handleDuplicate = async (doc) => {
    const { id, created_at, updated_at, ...rest } = doc;
    try {
      await createDoc({ ...rest, title: rest.title + " (copie)" });
      setDetailOpen(false);
      toast("Dupliqué ✓", "success");
    } catch (e) {
      toast("Erreur: " + e.message, "error");
    }
  };

  // Cell drop handler
  const handleCellDrop = useCallback(
    async (file, typeId, domainId) => {
      try {
        setUploading(true);
        toast(`Upload de ${file.name}...`, "info");

        let content = null;
        if (typeId === "html") {
          content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(String(ev.target.result || ""));
            reader.onerror = () =>
              reject(new Error("Impossible de lire le fichier HTML"));
            reader.readAsText(file);
          });
        }

        const uploaded = await api.uploadFile(file);
        const doc = await createDoc({
          title: file.name.replace(/\.[^.]+$/, ""),
          type: typeId,
          domain: domainId,
          input_mode: "file",
          status: "draft",
          content,
          url: uploaded.url,
          storage_path: uploaded.storage_path,
          file_name: uploaded.file_name,
          file_mime: uploaded.file_mime,
          tags: [],
        });
        toast(`"${doc.title}" créé ✓`, "success");
      } catch (e) {
        toast("Erreur: " + e.message, "error");
      } finally {
        setUploading(false);
      }
    },
    [createDoc, toast],
  );

  // Global drop (no cell context)
  const handleGlobalDrop = useCallback((file) => {
    const detectedType = detectTypeFromFile(file);
    const detectedDomain = detectDomainFromName(file.name);
    if (detectedDomain) {
      // Auto-assign domain, open form prefilled with the dropped file.
      openAdd({
        file,
        type: detectedType,
        domain: detectedDomain,
        title: file.name.replace(/\.[^.]+$/, ""),
        input_mode: "file",
      });
    } else {
      setPickerFile(file);
      setPickerType(detectedType);
      setPickerOpen(true);
    }
  }, []);

  const handlePickerConfirm = async (typeId, domainId) => {
    const file = pickerFile;
    setPickerOpen(false);
    if (!file) return;
    openAdd({
      file,
      type: typeId,
      domain: domainId,
      title: file.name.replace(/\.[^.]+$/, ""),
      input_mode: "file",
    });
    setPickerFile(null);
  };

  // Export
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(docs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-matrix-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Export JSON ✓", "success");
  };

  // Import
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const arr = JSON.parse(ev.target.result);
        if (!Array.isArray(arr)) throw new Error("Format invalide");
        if (!window.confirm(`Importer ${arr.length} contenus ?`)) return;
        let added = 0;
        for (const d of arr) {
          if (!docs.find((x) => x.id === d.id)) {
            await createDoc(d);
            added++;
          }
        }
        toast(`${added} importés ✓`, "success");
      } catch (err) {
        toast("Fichier invalide: " + err.message, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <TopBar
        docCount={docs.length}
        synced={synced}
        onAdd={() => openAdd()}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main
        style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 80px" }}
      >
        {/* Title Section */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 10,
              color: "var(--ink)",
            }}
          >
            Content Production{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #e8562a, #c43a2c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OS
            </span>
          </h1>
          <p
            style={{
              color: "var(--ink-soft)",
              maxWidth: 720,
              fontSize: "1rem",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Le centre de pilotage de vos contenus. Gérez, organisez et déployez
            vos actifs digitaux à travers une interface matricielle
            intelligente.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: "var(--red-soft)",
              border: "1px solid #f4b8b1",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: "0.88rem",
            }}
          >
            <span style={{ color: "var(--red)", fontWeight: 600 }}>
              ⚠ Erreur serveur :
            </span>
            <span style={{ color: "var(--ink-soft)" }}>{error}</span>
            <button
              onClick={fetchAll}
              style={{
                marginLeft: "auto",
                padding: "4px 12px",
                borderRadius: 6,
                background: "var(--red)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* KPIs */}
        {!loading && <KPIs docs={docs} />}

        {/* Toolbar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          filterType={filterType}
          setFilterType={setFilterType}
          filterDomain={filterDomain}
          setFilterDomain={setFilterDomain}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          view={view}
          setView={setView}
        />

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "50px 20px",
              textAlign: "center",
              color: "var(--ink-mute)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: "2px solid var(--border)",
                borderTopColor: "var(--ink)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Chargement depuis Supabase...
          </div>
        )}

        {/* Views */}
        {!loading && view === "matrix" && (
          <MatrixView
            docs={filtered}
            uploading={uploading}
            onCellClick={(typeId, domainId) => {
              setCellType(typeId);
              setCellDomain(domainId);
              setCellOpen(true);
            }}
            onCellDrop={handleCellDrop}
          />
        )}
        {!loading && view === "list" && (
          <ListView
            docs={filtered}
            onView={(d) => {
              setDetailDoc(d);
              setDetailOpen(true);
            }}
          />
        )}
        {!loading && view === "gallery" && (
          <GalleryView
            docs={filtered}
            onView={(d) => {
              setDetailDoc(d);
              setDetailOpen(true);
            }}
          />
        )}

        {/* FAB */}
        <button
          className="fab"
          onClick={() => openAdd()}
          title="Nouveau contenu"
        >
          +
        </button>
      </main>

      {/* Modals */}
      <DocForm
        open={formOpen}
        doc={formDoc}
        prefill={formPrefill}
        onSave={handleSave}
        onClose={() => setFormOpen(false)}
        toast={toast}
      />
      <DocDetail
        open={detailOpen}
        doc={detailDoc}
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
      <CellExplorer
        open={cellOpen}
        typeId={cellType}
        domainId={cellDomain}
        docs={docs}
        onClose={() => setCellOpen(false)}
        onView={(d) => {
          setCellOpen(false);
          setDetailDoc(d);
          setDetailOpen(true);
        }}
        onEdit={(d) => openEdit(d)}
        onDelete={(id) => handleDelete(id)}
        onAdd={(prefill) => {
          setCellOpen(false);
          openAdd(prefill);
        }}
        onDrop={handleCellDrop}
      />
      <DomainPicker
        open={pickerOpen}
        file={pickerFile}
        detectedType={pickerType}
        onConfirm={handlePickerConfirm}
        onClose={() => {
          setPickerOpen(false);
          setPickerFile(null);
        }}
      />
      <GlobalDrop onFileDrop={handleGlobalDrop} />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

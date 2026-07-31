"use client";

import {
  Camera,
  Check,
  FileUp,
  FolderOpen,
  Link2,
  Paperclip,
  Search,
  Upload,
  Video,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useMemo,
  useState,
} from "react";
import {
  type MediaCategory,
  type MediaMetadata,
  type MediaProfile,
  type MediaSource,
  addExternalMedia,
  formatFileSize,
  linkMediaToContext,
  mediaCategoryLabels,
  storeMediaFiles,
} from "./workflow-data";

type AttachmentSource = "device" | "camera" | "library" | "link";

type AttachmentPickerProps = {
  profile: MediaProfile;
  category?: MediaCategory;
  linkedWorkflowIds?: string[];
  linkedTaskIds?: string[];
  linkedSubtaskIds?: string[];
  attachedIds?: string[];
  media: MediaMetadata[];
  onRefresh: () => void;
  onAttach?: (items: MediaMetadata[]) => void;
  openByDefault?: boolean;
  variant?: "compact" | "hub";
};

const sourceLabels: Record<
  AttachmentSource,
  { label: string; icon: React.ReactNode }
> = {
  device: { label: "Dispositivo", icon: <FileUp size={14} /> },
  camera: { label: "Cámara", icon: <Camera size={14} /> },
  library: { label: "Equipo", icon: <FolderOpen size={14} /> },
  link: { label: "Enlace", icon: <Link2 size={14} /> },
};

const profileLabels: Record<MediaProfile, string> = {
  corporate: "Corporativo",
  team: "Equipo",
  member: "Miembro",
  shared: "Compartido",
};

function canUseLibraryItem(
  targetProfile: MediaProfile,
  itemProfile: MediaProfile,
) {
  if (targetProfile === "shared" || itemProfile === "shared") return true;
  if (targetProfile === "corporate") return itemProfile === "corporate";
  if (targetProfile === "team") {
    return itemProfile === "corporate" || itemProfile === "team";
  }
  return itemProfile === "team" || itemProfile === "member";
}

export default function AttachmentPicker({
  profile,
  category = "evidence",
  linkedWorkflowIds = [],
  linkedTaskIds = [],
  linkedSubtaskIds = [],
  attachedIds = [],
  media,
  onRefresh,
  onAttach,
  openByDefault = false,
  variant = "compact",
}: AttachmentPickerProps) {
  const [source, setSource] = useState<AttachmentSource>("device");
  const [isOpen, setIsOpen] = useState(openByDefault);
  const [notice, setNotice] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const availableLibrary = useMemo(() => {
    const query = librarySearch.trim().toLowerCase();
    return [...media]
      .filter((item) => canUseLibraryItem(profile, item.profile))
      .filter((item) => !attachedIds.includes(item.id))
      .filter(
        (item) =>
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query),
      )
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [attachedIds, librarySearch, media, profile]);

  const uploadFiles = async (files: File[], mediaSource: MediaSource) => {
    if (files.length === 0) return;
    setNotice("Guardando y vinculando…");
    const result = await storeMediaFiles(files, {
      profile,
      category,
      source: mediaSource,
      linkedWorkflowIds,
      linkedTaskIds,
      linkedSubtaskIds,
    });
    onRefresh();
    onAttach?.(result.items);
    const uploaded = `${result.items.length} ${result.items.length === 1 ? "archivo vinculado" : "archivos vinculados"}.`;
    const rejected =
      result.rejected.length > 0
        ? ` ${result.rejected.map((item) => `${item.name}: ${item.reason}`).join(" ")}`
        : "";
    setNotice(`${uploaded}${rejected}`);
  };

  const handleFiles = async (
    event: ChangeEvent<HTMLInputElement>,
    mediaSource: MediaSource,
  ) => {
    await uploadFiles(Array.from(event.target.files ?? []), mediaSource);
    event.target.value = "";
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    await uploadFiles(Array.from(event.dataTransfer.files), "device");
  };

  const attachFromLibrary = (item: MediaMetadata) => {
    const updated = linkMediaToContext(item, {
      linkedWorkflowIds,
      linkedTaskIds,
      linkedSubtaskIds,
    });
    onRefresh();
    onAttach?.([updated]);
    setNotice(`${item.name} quedó vinculado sin duplicar el archivo.`);
  };

  const addLink = () => {
    const cleanUrl = linkUrl.trim();
    const cleanName = linkName.trim();
    if (!cleanUrl || !cleanName) {
      setNotice("Agrega nombre y URL de la referencia.");
      return;
    }
    try {
      new URL(cleanUrl);
    } catch {
      setNotice("El enlace no tiene un formato válido.");
      return;
    }
    const entry = addExternalMedia(cleanName, cleanUrl, {
      profile,
      category,
      linkedWorkflowIds,
      linkedTaskIds,
      linkedSubtaskIds,
    });
    onRefresh();
    onAttach?.([entry]);
    setLinkName("");
    setLinkUrl("");
    setNotice("Enlace agregado y vinculado.");
  };

  return (
    <details
      className={`attachment-picker variant-${variant}`}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>
        <span>
          <Paperclip size={14} />
          Adjuntar evidencia
        </span>
        <small>Cámara · dispositivo · equipo · enlace</small>
      </summary>

      <div className="attachment-picker-body">
        <div className="attachment-source-tabs" role="tablist">
          {(Object.keys(sourceLabels) as AttachmentSource[]).map((sourceKey) => (
            <button
              className={source === sourceKey ? "active" : ""}
              key={sourceKey}
              onClick={() => setSource(sourceKey)}
              role="tab"
              aria-selected={source === sourceKey}
            >
              {sourceLabels[sourceKey].icon}
              {sourceLabels[sourceKey].label}
            </button>
          ))}
        </div>

        {source === "device" && (
          <div
            className="attachment-device-drop"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload size={21} />
            <strong>Sube cualquier tipo de archivo</strong>
            <span>
              Documentos, imágenes, video, audio, ZIP, diseño, código u otro
              formato · máximo 100 MB
            </span>
            <label>
              <FileUp size={14} />
              Elegir archivos
              <input
                type="file"
                multiple
                onChange={(event) => handleFiles(event, "device")}
              />
            </label>
          </div>
        )}

        {source === "camera" && (
          <div className="attachment-camera-grid">
            <label>
              <Camera size={22} />
              <strong>Tomar fotografía</strong>
              <span>Usa la cámara disponible del teléfono o equipo.</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => handleFiles(event, "camera")}
              />
            </label>
            <label>
              <Video size={22} />
              <strong>Grabar video</strong>
              <span>Captura demostraciones, entregables o incidencias.</span>
              <input
                type="file"
                accept="video/*"
                capture="environment"
                onChange={(event) => handleFiles(event, "camera")}
              />
            </label>
          </div>
        )}

        {source === "library" && (
          <div className="attachment-library">
            <label className="attachment-library-search">
              <Search size={14} />
              <input
                value={librarySearch}
                onChange={(event) => setLibrarySearch(event.target.value)}
                placeholder="Buscar en la biblioteca autorizada…"
              />
            </label>
            <div className="attachment-library-list">
              {availableLibrary.slice(0, variant === "hub" ? 12 : 6).map((item) => (
                <article key={item.id}>
                  <FolderOpen size={15} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {profileLabels[item.profile]} ·{" "}
                      {mediaCategoryLabels[item.category]} ·{" "}
                      {formatFileSize(item.size)}
                    </small>
                  </span>
                  <button onClick={() => attachFromLibrary(item)}>
                    <Paperclip size={12} />
                    Vincular
                  </button>
                </article>
              ))}
              {availableLibrary.length === 0 && (
                <div className="attachment-library-empty">
                  No hay archivos autorizados disponibles para este perfil.
                </div>
              )}
            </div>
          </div>
        )}

        {source === "link" && (
          <div className="attachment-link-form">
            <input
              value={linkName}
              onChange={(event) => setLinkName(event.target.value)}
              placeholder="Nombre del archivo o referencia"
            />
            <input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://Drive, OneDrive, Dropbox, YouTube…"
            />
            <button onClick={addLink}>
              <Link2 size={14} />
              Vincular enlace
            </button>
          </div>
        )}

        {notice && (
          <div className="attachment-notice">
            <Check size={13} />
            {notice}
          </div>
        )}
      </div>
    </details>
  );
}

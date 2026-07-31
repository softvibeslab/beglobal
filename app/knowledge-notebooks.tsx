"use client";

import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Check,
  FileSearch,
  FolderPlus,
  GraduationCap,
  Link2,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type MediaMetadata,
  type MediaNotebook,
  type MediaProfile,
  knowledgeStatusLabels,
  loadNotebooks,
  mediaCategoryLabels,
  saveNotebooks,
} from "./workflow-data";

type RetrievalResult = {
  source: MediaMetadata;
  score: number;
  snippet: string;
};

const profileLabels: Record<MediaProfile, string> = {
  corporate: "Corporativo",
  team: "Equipo interno",
  member: "Miembro / socio",
  shared: "Compartido",
};

function ProfileIcon({ profile }: { profile: MediaProfile }) {
  if (profile === "corporate") return <Bot size={16} />;
  if (profile === "team") return <Users size={16} />;
  if (profile === "member") return <GraduationCap size={16} />;
  return <BookOpenCheck size={16} />;
}

function sourceIsVisible(
  notebookProfile: MediaProfile,
  sourceProfile: MediaProfile,
) {
  if (notebookProfile === "shared" || sourceProfile === "shared") return true;
  if (notebookProfile === "corporate") return sourceProfile === "corporate";
  if (notebookProfile === "team") {
    return sourceProfile === "corporate" || sourceProfile === "team";
  }
  return sourceProfile === "team" || sourceProfile === "member";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function searchTokens(value: string) {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function buildSnippet(source: MediaMetadata, tokens: string[]) {
  const material = (
    source.contentExcerpt ||
    source.notes ||
    "Esta fuente todavía no tiene texto indexado. Agrega notas para hacerla consultable."
  ).trim();
  const normalizedMaterial = normalize(material);
  const firstIndex = tokens
    .map((token) => normalizedMaterial.indexOf(token))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const start = Math.max(0, (firstIndex ?? 0) - 90);
  const excerpt = material.slice(start, start + 360);
  return `${start > 0 ? "…" : ""}${excerpt}${start + 360 < material.length ? "…" : ""}`;
}

export default function KnowledgeNotebooks({
  media,
}: {
  media: MediaMetadata[];
}) {
  const [notebooks, setNotebooks] = useState<MediaNotebook[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [sourceToAdd, setSourceToAdd] = useState("");
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<RetrievalResult[]>([]);
  const [answerNotice, setAnswerNotice] = useState("");

  useEffect(() => {
    const stored = loadNotebooks();
    setNotebooks(stored);
    setSelectedId(stored[0]?.id ?? "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveNotebooks(notebooks);
  }, [hydrated, notebooks]);

  const active =
    notebooks.find((notebook) => notebook.id === selectedId) ?? notebooks[0];

  const activeSources = useMemo(
    () =>
      active
        ? active.sourceIds
            .map((id) => media.find((source) => source.id === id))
            .filter((source): source is MediaMetadata => Boolean(source))
        : [],
    [active, media],
  );

  const availableSources = useMemo(
    () =>
      active
        ? media.filter(
            (source) =>
              !active.sourceIds.includes(source.id) &&
              sourceIsVisible(active.profile, source.profile),
          )
        : [],
    [active, media],
  );

  const updateActive = (
    updater: (notebook: MediaNotebook) => MediaNotebook,
  ) => {
    if (!active) return;
    setNotebooks((current) =>
      current.map((notebook) =>
        notebook.id === active.id
          ? { ...updater(notebook), updatedAt: new Date().toISOString() }
          : notebook,
      ),
    );
  };

  const addNotebook = () => {
    const now = new Date().toISOString();
    const id = `notebook-${Date.now()}`;
    const notebook: MediaNotebook = {
      id,
      title: "Nuevo notebook",
      profile: "team",
      objective: "Define qué conocimiento debe concentrar esta colección.",
      instructions:
        "Indica cómo comparar las fuentes, qué priorizar y qué debe marcarse como incertidumbre.",
      summary: "",
      questions: "",
      sourceIds: [],
      createdAt: now,
      updatedAt: now,
    };
    setNotebooks((current) => [...current, notebook]);
    setSelectedId(id);
    setResults([]);
  };

  const deleteNotebook = () => {
    if (!active) return;
    if (!window.confirm(`¿Eliminar el notebook “${active.title}”?`)) return;
    const remaining = notebooks.filter((notebook) => notebook.id !== active.id);
    setNotebooks(remaining);
    setSelectedId(remaining[0]?.id ?? "");
    setResults([]);
  };

  const addSource = () => {
    if (!sourceToAdd || !active) return;
    updateActive((notebook) => ({
      ...notebook,
      sourceIds: [...notebook.sourceIds, sourceToAdd],
    }));
    setSourceToAdd("");
  };

  const removeSource = (sourceId: string) => {
    updateActive((notebook) => ({
      ...notebook,
      sourceIds: notebook.sourceIds.filter((id) => id !== sourceId),
    }));
    setResults((current) =>
      current.filter((result) => result.source.id !== sourceId),
    );
  };

  const askNotebook = () => {
    const tokens = searchTokens(question);
    if (!active || tokens.length === 0) {
      setResults([]);
      setAnswerNotice("Escribe una pregunta más específica.");
      return;
    }
    if (activeSources.length === 0) {
      setResults([]);
      setAnswerNotice("Este notebook todavía no tiene fuentes.");
      return;
    }
    const ranked = activeSources
      .map((source) => {
        const corpus = normalize(
          [
            source.name,
            source.notes,
            source.contentExcerpt,
            source.tags?.join(" "),
            mediaCategoryLabels[source.category],
          ].join(" "),
        );
        const matches = tokens.reduce(
          (score, token) => score + (corpus.includes(token) ? 1 : 0),
          0,
        );
        const statusBoost =
          source.knowledgeStatus === "approved"
            ? 0.4
            : source.knowledgeStatus === "reviewed"
              ? 0.2
              : 0;
        return {
          source,
          score: matches + statusBoost,
          snippet: buildSnippet(source, tokens),
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    setResults(ranked);
    setAnswerNotice(
      ranked.length > 0
        ? `${ranked.length} ${ranked.length === 1 ? "fuente relacionada encontrada" : "fuentes relacionadas encontradas"}.`
        : "No encontré coincidencias en el contenido indexado. Agrega notas o una fuente de texto.",
    );
  };

  if (!active) {
    return (
      <div className="notebook-empty panel">
        <BookOpenCheck size={27} />
        <strong>Crea el primer notebook</strong>
        <button onClick={addNotebook}>
          <Plus size={14} />
          Crear notebook
        </button>
      </div>
    );
  }

  return (
    <section className="notebook-workspace">
      <aside className="notebook-library panel">
        <div className="notebook-library-head">
          <span>
            <BookOpenCheck size={16} />
            NOTEBOOKS
          </span>
          <button onClick={addNotebook} aria-label="Crear notebook">
            <FolderPlus size={15} />
          </button>
        </div>
        <div className="notebook-library-list">
          {notebooks.map((notebook) => (
            <button
              className={notebook.id === active.id ? "active" : ""}
              key={notebook.id}
              onClick={() => {
                setSelectedId(notebook.id);
                setResults([]);
                setAnswerNotice("");
              }}
            >
              <ProfileIcon profile={notebook.profile} />
              <span>
                <strong>{notebook.title}</strong>
                <small>
                  {profileLabels[notebook.profile]} ·{" "}
                  {notebook.sourceIds.length} fuentes
                </small>
              </span>
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
        <button className="notebook-delete" onClick={deleteNotebook}>
          <Trash2 size={13} />
          Eliminar seleccionado
        </button>
      </aside>

      <div className="notebook-main">
        <article className="notebook-definition panel">
          <div className="notebook-title-row">
            <BookOpenCheck size={20} />
            <input
              value={active.title}
              onChange={(event) =>
                updateActive((notebook) => ({
                  ...notebook,
                  title: event.target.value,
                }))
              }
              aria-label="Nombre del notebook"
            />
            <select
              value={active.profile}
              onChange={(event) =>
                updateActive((notebook) => ({
                  ...notebook,
                  profile: event.target.value as MediaProfile,
                  sourceIds: notebook.sourceIds.filter((sourceId) => {
                    const source = media.find((item) => item.id === sourceId);
                    return (
                      source &&
                      sourceIsVisible(
                        event.target.value as MediaProfile,
                        source.profile,
                      )
                    );
                  }),
                }))
              }
            >
              {(Object.keys(profileLabels) as MediaProfile[]).map((profile) => (
                <option value={profile} key={profile}>
                  {profileLabels[profile]}
                </option>
              ))}
            </select>
          </div>
          <label>
            <span>OBJETIVO DE LA COLECCIÓN</span>
            <textarea
              rows={2}
              value={active.objective}
              onChange={(event) =>
                updateActive((notebook) => ({
                  ...notebook,
                  objective: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>INSTRUCCIONES PARA ANALIZAR</span>
            <textarea
              rows={3}
              value={active.instructions}
              onChange={(event) =>
                updateActive((notebook) => ({
                  ...notebook,
                  instructions: event.target.value,
                }))
              }
            />
          </label>
        </article>

        <article className="notebook-sources panel">
          <div className="notebook-section-head">
            <div>
              <span>FUENTES DEL NOTEBOOK</span>
              <strong>{activeSources.length} vinculadas</strong>
            </div>
            <div className="notebook-add-source">
              <select
                value={sourceToAdd}
                onChange={(event) => setSourceToAdd(event.target.value)}
              >
                <option value="">Agregar desde el repositorio…</option>
                {availableSources.map((source) => (
                  <option value={source.id} key={source.id}>
                    {mediaCategoryLabels[source.category]} · {source.name}
                  </option>
                ))}
              </select>
              <button onClick={addSource} disabled={!sourceToAdd}>
                <Plus size={14} />
                Agregar
              </button>
            </div>
          </div>
          <div className="notebook-source-list">
            {activeSources.map((source) => (
              <article key={source.id}>
                {source.externalUrl ? <Link2 size={16} /> : <FileSearch size={16} />}
                <span>
                  <strong>{source.name}</strong>
                  <small>
                    {mediaCategoryLabels[source.category]} ·{" "}
                    {knowledgeStatusLabels[source.knowledgeStatus ?? "inbox"]}
                    {source.tags?.length ? ` · ${source.tags.join(", ")}` : ""}
                  </small>
                </span>
                <button
                  onClick={() => removeSource(source.id)}
                  aria-label={`Quitar ${source.name}`}
                >
                  <X size={13} />
                </button>
              </article>
            ))}
            {activeSources.length === 0 && (
              <div className="notebook-source-empty">
                Agrega archivos o enlaces desde el repositorio.
              </div>
            )}
          </div>
        </article>

        <div className="notebook-analysis-grid">
          <article className="notebook-ask panel">
            <div className="notebook-panel-label">
              <Search size={16} />
              CONSULTAR FUENTES
            </div>
            <h3>Haz una pregunta al notebook</h3>
            <p>
              Busca coincidencias en nombres, etiquetas, notas y archivos de
              texto. Cada resultado conserva su fuente.
            </p>
            <div className="notebook-question">
              <textarea
                rows={3}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ejemplo: ¿qué necesita aprender el equipo antes de entrenar al socio?"
              />
              <button onClick={askNotebook}>
                <Sparkles size={15} />
                Consultar
              </button>
            </div>
            {answerNotice && (
              <div className="notebook-answer-notice">
                <Check size={13} />
                {answerNotice}
              </div>
            )}
            <div className="notebook-results">
              {results.map((result, index) => (
                <article key={result.source.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{result.source.name}</strong>
                    <p>{result.snippet}</p>
                    <small>
                      Fuente · {mediaCategoryLabels[result.source.category]} ·{" "}
                      {knowledgeStatusLabels[
                        result.source.knowledgeStatus ?? "inbox"
                      ]}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="notebook-brief panel">
            <div className="notebook-panel-label">
              <MessageSquareText size={16} />
              SÍNTESIS CURADA
            </div>
            <label>
              <span>Resumen ejecutivo</span>
              <textarea
                rows={8}
                value={active.summary}
                onChange={(event) =>
                  updateActive((notebook) => ({
                    ...notebook,
                    summary: event.target.value,
                  }))
                }
                placeholder="Conclusiones validadas, contradicciones y decisiones…"
              />
            </label>
            <label>
              <span>Preguntas guía</span>
              <textarea
                rows={8}
                value={active.questions}
                onChange={(event) =>
                  updateActive((notebook) => ({
                    ...notebook,
                    questions: event.target.value,
                  }))
                }
                placeholder="Una pregunta por línea…"
              />
            </label>
          </article>
        </div>
      </div>
    </section>
  );
}

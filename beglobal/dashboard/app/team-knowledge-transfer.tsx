"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck2,
  FolderKanban,
  Link2,
  MessageSquareText,
  ShieldAlert,
} from "lucide-react";
import {
  knowledgeTransferEntries,
  knowledgeTransferLoop,
  statusDescriptions,
  statusLabels,
  type KnowledgeTransferStatus,
} from "./knowledge-transfer-data";

const statusTone: Record<KnowledgeTransferStatus, string> = {
  confirmed: "confirmed",
  proposed: "proposed",
  assumption: "assumption",
  blocked: "blocked",
};

export default function TeamKnowledgeTransfer({
  onOpenMediaHub,
}: {
  onOpenMediaHub: () => void;
}) {
  const counts = knowledgeTransferEntries.reduce(
    (acc, entry) => {
      acc[entry.status] += 1;
      return acc;
    },
    { confirmed: 0, proposed: 0, assumption: 0, blocked: 0 } as Record<
      KnowledgeTransferStatus,
      number
    >,
  );

  return (
    <>
      <section className="knowledge-transfer-hero">
        <div>
          <span>TEAM KNOWLEDGE LOOP</span>
          <h1>Lo conversado se convierte en operación visible.</h1>
          <p>
            Este módulo refleja aprendizajes, decisiones y protocolos nacidos en
            el perfil Team, y deja el puente listo hacia Media Hub para adjuntar
            audios, capturas, documentos, links y plantillas.
          </p>
        </div>
        <aside>
          <strong>{knowledgeTransferEntries.length}</strong>
          <span>entradas iniciales</span>
          <small>Fuente: chat Be Global Team + guardrails del piloto</small>
          <button className="knowledge-media-open" onClick={onOpenMediaHub}>
            <FolderKanban size={15} />
            Abrir Media Hub
          </button>
        </aside>
      </section>

      <section className="knowledge-transfer-summary">
        {(
          Object.keys(statusLabels) as KnowledgeTransferStatus[]
        ).map((status) => (
          <article className={`knowledge-status-card ${statusTone[status]}`} key={status}>
            <span>{statusLabels[status]}</span>
            <strong>{counts[status]}</strong>
            <p>{statusDescriptions[status]}</p>
          </article>
        ))}
      </section>

      <section className="knowledge-transfer-layout">
        <div className="knowledge-transfer-main">
          {knowledgeTransferEntries.map((entry) => (
            <article className="knowledge-entry-card" key={entry.id}>
              <div className="knowledge-entry-head">
                <div>
                  <span className={`knowledge-status-pill ${statusTone[entry.status]}`}>
                    {statusLabels[entry.status]}
                  </span>
                  <h2>{entry.title}</h2>
                  <p>{entry.source}</p>
                </div>
                <div className="knowledge-owner">
                  <span>OWNER</span>
                  <strong>{entry.owner}</strong>
                  <small>{entry.profile}</small>
                </div>
              </div>

              <div className="knowledge-entry-grid">
                <div>
                  <span>Situación</span>
                  <p>{entry.situation}</p>
                </div>
                <div>
                  <span>Decisión / práctica</span>
                  <p>{entry.decision}</p>
                </div>
                <div>
                  <span>Salida reusable</span>
                  <p>{entry.reusableOutput}</p>
                </div>
                <div>
                  <span>Acción mínima</span>
                  <p>{entry.actionMinimum}</p>
                </div>
              </div>

              <div className="knowledge-evidence-row">
                <div>
                  <FileCheck2 size={17} />
                  <span>Evidencia esperada</span>
                  <p>{entry.evidenceExpected}</p>
                </div>
                <div>
                  <ShieldAlert size={17} />
                  <span>Riesgo / límite</span>
                  <p>{entry.riskOrLimit}</p>
                </div>
              </div>

              <div className="knowledge-media-links">
                <div className="knowledge-media-title">
                  <FolderKanban size={18} />
                  <div>
                    <strong>Vínculos sugeridos a Media Hub</strong>
                    <small>
                      Crear o adjuntar estos activos desde Media Hub para dejar
                      trazabilidad.
                    </small>
                  </div>
                </div>
                <div className="knowledge-media-grid">
                  {entry.mediaHubLinks.map((link) => (
                    <div className="knowledge-media-chip" key={link.label}>
                      <Link2 size={15} />
                      <div>
                        <strong>{link.label}</strong>
                        <span>{link.category}</span>
                        <p>{link.note}</p>
                        <small>{link.suggestedTags.join(" · ")}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <details className="knowledge-chat-source">
                <summary>
                  <MessageSquareText size={16} />
                  Ver extracto de conversación origen
                </summary>
                {entry.chatMessages.map((message) => (
                  <blockquote key={message}>{message}</blockquote>
                ))}
              </details>

              <div className="knowledge-escalation">
                <AlertTriangle size={16} />
                <span>{entry.escalation}</span>
              </div>
            </article>
          ))}
        </div>

        <aside className="knowledge-transfer-aside">
          <div className="panel knowledge-loop-panel">
            <div className="panel-label">
              <span>LOOP OPERATIVO</span>
              <Database size={16} />
            </div>
            <h2>Chat → Dashboard → Media Hub.</h2>
            <div className="knowledge-loop-list">
              {knowledgeTransferLoop.map((step, index) => (
                <div className="knowledge-loop-step" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel knowledge-next-panel">
            <div className="panel-label">
              <span>SIGUIENTE MEJORA</span>
              <CheckCircle2 size={16} />
            </div>
            <h2>Sincronización segura.</h2>
            <p>
              Hoy queda reflejado en código del dashboard. Para sincronización en
              vivo desde Telegram se requiere backend, autenticación, permisos de
              escritura y QA antes de producción.
            </p>
            <div className="knowledge-next-action">
              <span>Próximo paso</span>
              <strong>Definir si la bitácora será manual, importada o automática.</strong>
              <ArrowRight size={16} />
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

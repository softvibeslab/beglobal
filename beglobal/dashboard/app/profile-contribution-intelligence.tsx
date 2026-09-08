import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  GitMerge,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  analysisGaps,
  contributionSources,
  memberDataBoundaries,
  memberImpactAreas,
  profileContributionAnalysis,
  reusableAssets,
  type EvidenceStatus,
} from "./profile-contribution-data";

const statusLabels: Record<EvidenceStatus, string> = {
  confirmed: "Confirmado",
  proposed: "Propuesto para Member",
  inferred: "Inferencia",
};

export default function ProfileContributionIntelligence() {
  const totalContributions = profileContributionAnalysis.coverage.reduce(
    (sum, profile) => sum + profile.includedContributions,
    0,
  );
  const totalSessions = profileContributionAnalysis.coverage.reduce(
    (sum, profile) => sum + profile.sessions,
    0,
  );

  return (
    <section className="tower-panel profile-intelligence">
      <div className="profile-intelligence-hero">
        <div>
          <span className="profile-intelligence-eyebrow">
            <BrainCircuit size={15} /> Inteligencia de contribuciones
          </span>
          <h2>Corporate + Team → Member</h2>
          <p>
            Lectura transversal de todo el aporte disponible de usuarios en los perfiles corporativo y
            de equipo, convertida en decisiones de experiencia para <strong>beglobal-member</strong> sin
            trasladar conversaciones privadas ni conocimiento no aprobado.
          </p>
        </div>
        <div className="profile-intelligence-total">
          <strong>{totalContributions}</strong>
          <span>aportaciones analizadas</span>
          <small>{totalSessions} sesiones · corte 14 ago 2026</small>
        </div>
      </div>

      <div className="profile-intelligence-note">
        <ShieldCheck size={17} />
        <p>
          <strong>Lectura gobernada:</strong> {profileContributionAnalysis.method}
        </p>
      </div>

      <div className="profile-intelligence-section-head">
        <div>
          <span>Cobertura del corpus</span>
          <h3>Qué aportó cada perfil</h3>
        </div>
        <p>{profileContributionAnalysis.scope}</p>
      </div>

      <div className="profile-corpus-grid">
        {profileContributionAnalysis.coverage.map((profile) => (
          <article className="profile-corpus-card" key={profile.profile}>
            <div className="profile-corpus-title">
              <div>
                <Users size={18} />
                <strong>{profile.profile}</strong>
              </div>
              <span>{profile.includedContributions} aportaciones</span>
            </div>
            <p>{profile.role}</p>
            <div className="profile-corpus-metrics">
              <div><strong>{profile.sessions}</strong><span>sesiones</span></div>
              <div><strong>{profile.contributors}</strong><span>usuarios agregados</span></div>
              <div><strong>{profile.period}</strong><span>periodo</span></div>
            </div>
            <div className="profile-signal-list">
              {profile.dominantSignals.map((signal) => (
                <div key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.messages}</strong>
                </div>
              ))}
            </div>
            <small>{profile.channels.join(" · ")} · Excluido: {profile.excluded}</small>
          </article>
        ))}
      </div>

      <div className="profile-findings-grid">
        {profileContributionAnalysis.executiveFindings.map((finding) => (
          <article key={finding.title}>
            <span className={`evidence-status ${finding.status}`}>
              {statusLabels[finding.status]}
            </span>
            <strong>{finding.title}</strong>
            <p>{finding.detail}</p>
          </article>
        ))}
      </div>

      <div className="profile-intelligence-section-head impact-head">
        <div>
          <span>Mapa de transferencia</span>
          <h3>Cómo aporta esta información a beglobal-member</h3>
        </div>
        <p>
          Corporate gobierna; Team convierte la operación en evidencia; Member recibe únicamente una
          experiencia simple, segura y accionable.
        </p>
      </div>

      <div className="member-impact-list">
        {memberImpactAreas.map((area) => (
          <article className="member-impact-row" key={area.id}>
            <div className="member-impact-signal">
              <span className={`evidence-status ${area.status}`}>{statusLabels[area.status]}</span>
              <strong>{area.signal}</strong>
            </div>
            <div>
              <span>Corporate aporta</span>
              <p>{area.corporateContribution}</p>
            </div>
            <ArrowRight className="member-impact-arrow" size={18} />
            <div>
              <span>Team aporta</span>
              <p>{area.teamContribution}</p>
            </div>
            <ArrowRight className="member-impact-arrow" size={18} />
            <div className="member-impact-result">
              <span>Member recibe</span>
              <p>{area.memberImpact}</p>
              <small><CheckCircle2 size={12} /> Evidencia: {area.evidenceExpected}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="profile-intelligence-section-head asset-head">
        <div>
          <span>Capitalización del aprendizaje</span>
          <h3>Activos reutilizables</h3>
        </div>
        <p>
          Entregables y patrones nacidos de las aportaciones. Su existencia está confirmada; su uso por
          Member depende del estado de aprobación indicado.
        </p>
      </div>

      <div className="profile-asset-grid">
        {reusableAssets.map((asset) => (
          <article key={asset.title}>
            <div>
              <span className={`evidence-status ${asset.status}`}>{statusLabels[asset.status]}</span>
              <small>{asset.origin}</small>
            </div>
            <strong>{asset.title}</strong>
            <p>{asset.contribution}</p>
            <div className="profile-asset-member">
              <ArrowRight size={13} />
              <span>{asset.memberUse}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="profile-intelligence-footer-grid">
        <article className="profile-boundaries">
          <div className="profile-intelligence-section-head compact">
            <div>
              <span>Separación por diseño</span>
              <h3>No transferir al miembro</h3>
            </div>
            <ShieldCheck size={22} />
          </div>
          <ul>
            {memberDataBoundaries.map((boundary) => <li key={boundary}>{boundary}</li>)}
          </ul>
        </article>

        <article className="profile-gaps">
          <div className="profile-intelligence-section-head compact">
            <div>
              <span>Validación pendiente</span>
              <h3>Brechas y límites del análisis</h3>
            </div>
            <AlertTriangle size={22} />
          </div>
          <ul>
            {analysisGaps.map((gap) => <li key={gap}>{gap}</li>)}
          </ul>
        </article>
      </div>

      <div className="profile-provenance">
        <div>
          <Database size={17} />
          <strong>Proveniencia</strong>
        </div>
        <div className="profile-source-list">
          {contributionSources.map((source) => <code key={source}>{source}</code>)}
        </div>
        <small>
          <GitMerge size={13} /> Conversaciones = evidencia operativa. SOURCE_MANIFEST.md y fuentes
          canónicas = autoridad. Ningún mensaje crudo se publica en este módulo.
        </small>
      </div>
    </section>
  );
}

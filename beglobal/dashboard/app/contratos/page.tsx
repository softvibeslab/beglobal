"use client";

import { Download, FileCheck2, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import styles from "./page.module.css";

const documents = {
  contrato: {
    label: "Contrato de prestación de servicios",
    status: "Borrador para revisión legal",
    icon: FileText,
    html: "/contratos/contrato-servicios.html",
    download: "/contratos/contrato-servicios.docx",
    points: [
      "Completar representantes, cargos y fechas",
      "Confirmar alcance de los 3 agentes y criterios de aceptación",
      "Validar honorarios, impuestos, pagos, garantía y soporte",
      "Acordar propiedad intelectual, datos, seguridad y proveedores terceros",
      "Cerrar anexos A, B y C antes de firmar",
    ],
  },
  nda: {
    label: "NDA · Convenio de confidencialidad",
    status: "Borrador para revisión",
    icon: ShieldCheck,
    html: "/contratos/nda-proveedor.html",
    download: "/contratos/nda-proveedor.docx",
    points: [
      "Completar datos legales de las partes",
      "Validar definición y excepciones de información confidencial",
      "Confirmar obligaciones de uso, custodia y devolución",
      "Revisar daños por incumplimiento y vigencia",
      "Completar jurisdicción, avisos y firmas",
    ],
  },
} as const;

type DocumentKey = keyof typeof documents;

export default function ContractsPage() {
  const [active, setActive] = useState<DocumentKey>("contrato");
  const document = documents[active];
  const Icon = document.icon;

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>BE GLOBAL · REVISIÓN DOCUMENTAL</p>
          <h1>Contrato y NDA</h1>
          <p className={styles.intro}>
            Consulta los borradores, descarga los archivos editables e identifica los puntos que deben cerrarse antes de firma.
          </p>
        </div>
        <div className={styles.reviewer}>
          <FileCheck2 size={20} />
          <div><span>Revisor asignado</span><strong>Slack · U0BJ3K6QA5R</strong></div>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Documentos">
        {(Object.keys(documents) as DocumentKey[]).map((key) => {
          const item = documents[key];
          const TabIcon = item.icon;
          return (
            <button key={key} className={active === key ? styles.activeTab : styles.tab} onClick={() => setActive(key)}>
              <TabIcon size={18} /> {item.label}
            </button>
          );
        })}
      </nav>

      <section className={styles.grid}>
        <aside className={styles.panel}>
          <div className={styles.documentTitle}>
            <span className={styles.icon}><Icon size={22} /></span>
            <div><h2>{document.label}</h2><span className={styles.status}>{document.status}</span></div>
          </div>

          <h3>Puntos para revisar</h3>
          <ul className={styles.checklist}>
            {document.points.map((point) => <li key={point}>{point}</li>)}
          </ul>

          <a className={styles.download} href={document.download} download>
            <Download size={18} /> Descargar DOCX editable
          </a>
          <p className={styles.note}>Documento de trabajo. No firmar hasta completar campos pendientes y contar con revisión legal.</p>
        </aside>

        <section className={styles.viewer} aria-label={`Vista de ${document.label}`}>
          <div className={styles.viewerBar}><span>Vista completa del documento</span><a href={document.html} target="_blank" rel="noreferrer">Abrir en otra pestaña</a></div>
          <iframe key={document.html} src={document.html} title={document.label} />
        </section>
      </section>
    </main>
  );
}

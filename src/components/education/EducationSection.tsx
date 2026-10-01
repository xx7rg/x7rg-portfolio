"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { credentialDocuments, credentials, type Credential, type CredentialType } from "@/content/credentials";
import { BookIcon, CertificateIcon, ChevronLeftIcon, ChevronRightIcon, CompassIcon, GraduationIcon } from "@/components/ui/icons";
import { MediaViewerProvider } from "@/components/media-viewer/MediaViewer";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/types";
import styles from "./education.module.css";

type FilterKey = "all" | CredentialType;

const filterOrder: readonly FilterKey[] = ["all", "academic", "training", "credential"];

const categoryIcon: Record<CredentialType, ComponentType<SVGProps<SVGSVGElement>>> = {
  academic: BookIcon,
  training: CompassIcon,
  credential: CertificateIcon,
};

/**
 * Revelar restrito: o bloco sobe e ganha opacidade uma vez, quando entra na tela — a mesma técnica
 * própria de BrandStorySection/ContactSection, reimplementada aqui para não acoplar esta seção a
 * outra superfície aprovada.
 */
function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** "2021–2024", "2023" ou a data de emissão de um certificado pontual — o que existir primeiro. */
function period(entry: Credential): string | null {
  if (entry.issueDate) return entry.issueDate;
  if (entry.startYear && entry.endYear) return `${entry.startYear}–${entry.endYear}`;
  if (entry.startYear) return `${entry.startYear}`;
  return null;
}

/**
 * Formação & Credenciais: arquivo profissional documentado, não um currículo nem uma vitrine de
 * certificados. Os três tipos são filtro real (+ "todos"), a lista é plana e o painel da direita é
 * o visualizador de evidência — sempre imagem (fase E2.2: o visualizador de PDF nativo do
 * navegador foi removido de propósito, porque expunha baixar/imprimir/abrir original, que Rogério
 * rejeitou). Os dois diplomas principais entram como derivados SANITIZADOS (RG/CPF/data de
 * nascimento/assinaturas apagados do pixel, não só cobertos por CSS); os certificados de curso são
 * páginas planas do PDF original (nunca continham dado sensível). Reusa o ZoomMedia pela mesma
 * interface pública de qualquer projeto — nunca o original, sempre o derivado.
 * Dissuasão de cópia casual (não é DRM — um documento visível num navegador sempre pode ser
 * capturado por print-screen; a proteção real é nunca publicar o original, só o derivado
 * saneado): `draggable={false}` + bloqueio do menu de contexto, escopados só à imagem da
 * evidência (o resto do portfólio continua com clique direito/arrastar normais).
 */
export function EducationSection({ dict }: { dict: Dictionary }) {
  const { education: copy, viewer } = dict;
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [manualSelectedId, setManualSelectedId] = useState<string | null>(null);
  const [documentIndex, setDocumentIndex] = useState(0);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const filtered = (activeFilter === "all" ? credentials : credentials.filter((entry) => entry.type === activeFilter))
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const selectedId = filtered.some((entry) => entry.id === manualSelectedId)
    ? manualSelectedId
    : (filtered.find((entry) => entry.featured)?.id ?? filtered[0]?.id ?? null);
  const selected = filtered.find((entry) => entry.id === selectedId) ?? null;

  // Reinicia o documento em foco sempre que a credencial selecionada muda (nunca o índice antigo
  // de uma credencial diferente). Ajuste de estado durante a renderização (padrão oficial do
  // React para "resetar estado quando uma prop muda"), não um efeito — evita o render em cascata.
  if (selectedId !== lastSelectedId) {
    setLastSelectedId(selectedId);
    setDocumentIndex(0);
  }

  const documents = selected ? credentialDocuments(selected) : [];
  const currentDocument = documents[documentIndex] ?? null;
  const hasMultipleDocuments = documents.length > 1;

  const selectCredential = (id: string) => setManualSelectedId(id);

  return (
    // Instância própria do MediaViewerProvider: o ZoomMedia exige um provedor ancestral, e o
    // único já existente (WorkController) só envolve a seção de projetos, não esta. Duas
    // instâncias independentes convivem sem conflito (cada uma com o próprio <dialog>, sem id
    // fixo); o `group="education"` já mantém a navegação do visualizador restrita a esta seção.
    <MediaViewerProvider labels={viewer}>
    <section id="education" className={styles.section} aria-labelledby="education-title" data-slug-section>
      <SectionLabel id="education-title" Icon={GraduationIcon}>
        {copy.label}
      </SectionLabel>

      <Reveal className={styles.reveal}>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.archiveNotice}>
          <p className={styles.archiveLabel}>{copy.archiveNotice.label}</p>
          <p className={styles.archiveBody}>{copy.archiveNotice.body}</p>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.frame}>
          <div className={styles.index}>
            <div className={styles.filters} role="group" aria-label={copy.title}>
              {filterOrder.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={styles.filter}
                  aria-pressed={activeFilter === key}
                  onClick={() => setActiveFilter(key)}
                >
                  {copy.filters[key]}
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <ul className={styles.groupList}>
                {filtered.map((entry) => {
                  const Icon = categoryIcon[entry.type];
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        className={styles.entry}
                        aria-current={selectedId === entry.id ? "true" : undefined}
                        onClick={() => selectCredential(entry.id)}
                      >
                        {activeFilter === "all" && <Icon aria-hidden="true" className={styles.entryIcon} />}
                        <span className={styles.entryTitle}>{entry.title}</span>
                        {entry.institution && <span className={styles.entryInstitution}>{entry.institution}</span>}
                        {period(entry) && <span className={styles.entryPeriod}>{period(entry)}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={styles.groupEmpty}>{credentials.length > 0 ? copy.emptyCategory : copy.preparing}</p>
            )}
          </div>

          <div className={styles.evidence} aria-live="polite">
            {!selected ? (
              <p className={styles.evidenceEmpty}>{credentials.length > 0 ? copy.emptyCategory : copy.preparing}</p>
            ) : (
              <article className={styles.detail}>
                {selected.institution && <p className={styles.detailInstitution}>{selected.institution}</p>}
                <h3 className={styles.detailTitle}>{selected.title}</h3>
                {selected.area && <p className={styles.detailArea}>{selected.area}</p>}
                {period(selected) && <p className={styles.detailPeriod}>{period(selected)}</p>}
                {selected.description && <p className={styles.detailDescription}>{selected.description}</p>}
                {selected.skills && selected.skills.length > 0 && (
                  <ul className={styles.skills}>
                    {selected.skills.map((skill) => (
                      <li key={skill} className={styles.skill}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}

                {!currentDocument ? (
                  <p className={styles.evidenceEmpty}>{copy.evidenceUnavailable}</p>
                ) : (
                  <div className={styles.viewer}>
                    <div className={styles.evidenceGuard} onContextMenu={(event) => event.preventDefault()}>
                      <ZoomMedia
                        id={currentDocument.captionId}
                        group="education"
                        image={currentDocument.image}
                        alt={currentDocument.alt}
                        radius={8}
                        className={styles.documentFrame}
                      >
                        <Image
                          className={styles.documentImage}
                          src={currentDocument.image}
                          alt={currentDocument.alt}
                          sizes="(min-width: 900px) 480px, 92vw"
                          quality={90}
                          draggable={false}
                        />
                      </ZoomMedia>
                    </div>

                    {hasMultipleDocuments && (
                      <div className={styles.docNav}>
                        <button
                          type="button"
                          className={styles.docNavButton}
                          aria-label={copy.documentPrevious}
                          disabled={documentIndex === 0}
                          onClick={() => setDocumentIndex((i) => Math.max(0, i - 1))}
                        >
                          <ChevronLeftIcon aria-hidden="true" />
                        </button>
                        <span className={styles.docCounter}>
                          {documentIndex + 1} {viewer.of} {documents.length}
                        </span>
                        <button
                          type="button"
                          className={styles.docNavButton}
                          aria-label={copy.documentNext}
                          disabled={documentIndex === documents.length - 1}
                          onClick={() => setDocumentIndex((i) => Math.min(documents.length - 1, i + 1))}
                        >
                          <ChevronRightIcon aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {selected.sanitized && <p className={styles.privacyNotice}>{copy.privacyNotice}</p>}
                  </div>
                )}
              </article>
            )}
          </div>
        </div>
      </Reveal>
    </section>
    </MediaViewerProvider>
  );
}

import type { StaticImageData } from "next/image";
import type { CaptionKey } from "@/content/media-captions";
import famDiploma from "@/assets/credentials/fam-diploma.webp";
import universoDiploma from "@/assets/credentials/universo-diploma.webp";
import cftCarteira from "@/assets/credentials/cft-carteira.webp";
import kasolutionLogica from "@/assets/credentials/kasolution-logica-p1.webp";
import enapPowerBi1 from "@/assets/credentials/enap-power-bi-p1.webp";
import enapPowerBi2 from "@/assets/credentials/enap-power-bi-p2.webp";
import fgvTi from "@/assets/credentials/fgv-ti-p1.webp";
import enapSei1 from "@/assets/credentials/enap-sei-p1.webp";
import enapSei2 from "@/assets/credentials/enap-sei-p2.webp";
import enapNr121 from "@/assets/credentials/enap-nr12-p1.webp";
import enapNr122 from "@/assets/credentials/enap-nr12-p2.webp";

/**
 * Arquivo de Formação & Credenciais: fase E2.3 (borrão localizado, não mais tarja preta). Toda
 * evidência é imagem (nunca mais um PDF nativo do navegador). As três credenciais com dado pessoal
 * sensível (FAM, UNIVERSO, CFT) entram como derivados SANITIZADOS — a página relevante do original
 * renderizada e com APENAS os valores sensíveis (datas de nascimento, naturalidade, números de
 * RG/CPF/identidade, filiação, foto, assinaturas manuscritas, QR de verificação) borrados de forma
 * destrutiva no próprio pixel (Gaussian blur assado no raster, nunca uma caixa de CSS por cima) —
 * o resto do documento (instituição, título, texto público, moldura, cores) permanece visualmente
 * igual ao original. Os PDFs originais permanecem exclusivamente em D:\HD MEC\certficadoss\, nunca
 * entram no repositório. `sanitized: true` identifica as credenciais cujo documento publicado teve
 * informação pessoal removida — a seção usa essa marca (nunca o nome do arquivo) para decidir
 * quando mostrar o aviso de privacidade. Os cinco certificados de curso, sempre PUBLIC-SAFE, viraram
 * páginas planas do PDF original sem nenhum borrão (nunca continham dado sensível).
 */

/** Os três tipos de registro que a seção organiza (ver `dict.education.filters`). */
export type CredentialType = "academic" | "training" | "credential";

/**
 * Evidência de uma credencial: sempre uma imagem (nunca mais um PDF embutido). `image` é um import
 * estático de verdade (como toda mídia de projeto), `captionId` + `alt` habilitam o reuso do
 * ZoomMedia pela mesma interface pública de qualquer projeto.
 */
export type CredentialDocument = {
  kind: "jpg" | "png" | "webp";
  image: StaticImageData;
  captionId: CaptionKey;
  alt: string;
  label?: string;
};

/**
 * Uma credencial (acadêmica, curso/especialização ou certificado). A maioria dos campos é
 * opcional de propósito: os documentos reais trazem informação desigual entre si.
 */
export type Credential = {
  id: string;
  type: CredentialType;
  institution?: string;
  title: string;
  area?: string;
  startYear?: number;
  endYear?: number;
  /** Data de emissão, quando a credencial é um certificado pontual (não um período de estudo). */
  issueDate?: string;
  status?: string;
  location?: string;
  description?: string;
  skills?: readonly string[];
  /** Evidência principal (o documento mais representativo desta credencial). */
  document?: CredentialDocument;
  /** Evidências de apoio, além da principal (ex.: página 2 do mesmo certificado). */
  supportingDocuments?: readonly CredentialDocument[];
  /** Link externo de verificação da credencial (ex.: emissor com validação online). */
  credentialUrl?: string;
  /** Qualificação principal do perfil publicado — não é ranking de prestígio entre instituições. */
  featured?: boolean;
  /** Ordem editorial explícita (hierarquia deliberada, não a ordem da pasta-fonte). */
  order?: number;
  /** O documento publicado teve informação pessoal borrada (fase E2.3). Aciona o aviso de privacidade. */
  sanitized?: boolean;
};

/**
 * Todos os documentos de uma credencial, principal primeiro, sem os `undefined` — a base do
 * navegador de documentos (anterior/próximo + contador) no painel de evidência.
 */
export function credentialDocuments(entry: Credential): readonly CredentialDocument[] {
  return [entry.document, ...(entry.supportingDocuments ?? [])].filter(
    (doc): doc is CredentialDocument => doc !== undefined,
  );
}

/**
 * Hierarquia deliberada (fase E2.2): as duas formações principais primeiro (FAM, UNIVERSO — a
 * dupla identidade "Developer × Graphic Designer" do próprio portfólio), depois a credencial
 * profissional do CFT, depois os cursos complementares — ordenados por proximidade temática ao
 * perfil técnico/criativo publicado (programação e dados primeiro, depois gestão de TI, depois
 * processos administrativos e segurança do trabalho). Não é um ranking de prestígio institucional.
 */
export const credentials: readonly Credential[] = [
  {
    id: "fam-analise-desenvolvimento-sistemas",
    type: "academic",
    institution: "Centro Universitário das Américas — FAM",
    title: "Análise e Desenvolvimento de Sistemas",
    area: "Tecnologia da Informação",
    endYear: 2024,
    featured: true,
    order: 1,
    sanitized: true,
    document: {
      kind: "webp",
      image: famDiploma,
      captionId: "credential.fam",
      alt: "Diploma de Análise e Desenvolvimento de Sistemas, Centro Universitário das Américas — FAM, com dados pessoais borrados",
    },
  },
  {
    id: "universo-design-grafico",
    type: "academic",
    institution: "Universidade Salgado de Oliveira — UNIVERSO",
    title: "Design Gráfico",
    area: "Design",
    endYear: 2009,
    featured: true,
    order: 2,
    sanitized: true,
    document: {
      kind: "webp",
      image: universoDiploma,
      captionId: "credential.universo",
      alt: "Diploma de Design Gráfico, Universidade Salgado de Oliveira — UNIVERSO, com dados pessoais borrados",
    },
  },
  {
    id: "cft-eletrotecnica-mecatronica",
    type: "credential",
    institution: "Conselho Federal dos Técnicos Industriais — CFT",
    title: "Técnica em Eletrotécnica e Mecatrônica",
    area: "Engenharia",
    issueDate: "13/07/2020",
    order: 3,
    sanitized: true,
    document: {
      kind: "webp",
      image: cftCarteira,
      captionId: "credential.cft",
      alt: "Carteira de Identidade Profissional do CFT, Técnica em Eletrotécnica e Mecatrônica, com dados pessoais e foto borrados",
    },
  },
  {
    id: "kasolution-logica-programacao",
    type: "training",
    institution: "Centro Educacional Ka Solution",
    title: "Lógica de Programação",
    area: "Programação",
    issueDate: "04/09/2021",
    order: 4,
    document: {
      kind: "webp",
      image: kasolutionLogica,
      captionId: "credential.kasolutionLogica",
      alt: "Certificado de Lógica de Programação, Centro Educacional Ka Solution",
    },
  },
  {
    id: "enap-power-bi-gestao",
    type: "training",
    institution: "Escola Nacional de Administração Pública — Enap",
    title: "Aplicação do Power BI para Aprimoramento da Gestão",
    area: "Business Intelligence",
    issueDate: "12/10/2023",
    description: "Curso de 25 horas sobre Power BI aplicado à gestão: obtenção e modelagem de dados, cálculos, visualização, publicação e automatização.",
    skills: ["Power BI", "Modelagem de dados", "DAX", "Visualização de dados"],
    credentialUrl: "https://www.escolavirtual.gov.br",
    order: 5,
    document: {
      kind: "webp",
      image: enapPowerBi1,
      captionId: "credential.enapPowerBi1",
      alt: "Certificado de Aplicação do Power BI para Aprimoramento da Gestão, Enap, página 1",
    },
    supportingDocuments: [
      {
        kind: "webp",
        image: enapPowerBi2,
        captionId: "credential.enapPowerBi2",
        alt: "Certificado de Aplicação do Power BI para Aprimoramento da Gestão, Enap, página 2, com histórico do curso",
      },
    ],
  },
  {
    id: "fgv-fundamentos-gestao-ti",
    type: "training",
    institution: "FGV Online (Fundação Getulio Vargas)",
    title: "Fundamentos da Gestão de TI",
    area: "Gestão de TI",
    issueDate: "07/07/2020",
    description: "Curso autoinstrucional, nível de atualização, 5 horas.",
    order: 6,
    document: {
      kind: "webp",
      image: fgvTi,
      captionId: "credential.fgvTi",
      alt: "Declaração de Fundamentos da Gestão de TI, FGV Online",
    },
  },
  {
    id: "enap-sei-administrar",
    type: "training",
    institution: "Escola Nacional de Administração Pública — Enap",
    title: "Sistema Eletrônico de Informações — SEI! ADMINISTRAR",
    area: "Gestão Pública",
    issueDate: "13/10/2023",
    description: "Curso de 40 horas sobre administração do SEI: estrutura organizacional, controle de acesso, relatórios e auditoria.",
    skills: ["Administração do SEI", "Controle de acesso", "Auditoria de processos"],
    credentialUrl: "https://www.escolavirtual.gov.br",
    order: 7,
    document: {
      kind: "webp",
      image: enapSei1,
      captionId: "credential.enapSei1",
      alt: "Certificado do Sistema Eletrônico de Informações — SEI! ADMINISTRAR, Enap, página 1",
    },
    supportingDocuments: [
      {
        kind: "webp",
        image: enapSei2,
        captionId: "credential.enapSei2",
        alt: "Certificado do Sistema Eletrônico de Informações — SEI! ADMINISTRAR, Enap, página 2, com histórico do curso",
      },
    ],
  },
  {
    id: "enap-nr12-seguranca-maquinas",
    type: "training",
    institution: "Escola Nacional de Administração Pública — Enap",
    title: "Segurança em Máquinas e Equipamentos NR12 — Fundamentos Básicos",
    area: "Segurança do Trabalho",
    issueDate: "11/10/2023",
    description: "Curso de 8 horas sobre eletricidade, mecânica, hidráulica, pneumática e normas técnicas aplicadas à segurança de máquinas e equipamentos.",
    credentialUrl: "https://www.escolavirtual.gov.br",
    order: 8,
    document: {
      kind: "webp",
      image: enapNr121,
      captionId: "credential.enapNr121",
      alt: "Certificado de Segurança em Máquinas e Equipamentos NR12, Enap, página 1",
    },
    supportingDocuments: [
      {
        kind: "webp",
        image: enapNr122,
        captionId: "credential.enapNr122",
        alt: "Certificado de Segurança em Máquinas e Equipamentos NR12, Enap, página 2, com histórico do curso",
      },
    ],
  },
];

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
import facuminasInteligenciaArtificial from "@/assets/credentials/facuminas-inteligencia-artificial.webp";
import facuminasBusinessIntelligence from "@/assets/credentials/facuminas-business-intelligence.webp";
import facuminasPericiaForense from "@/assets/credentials/facuminas-pericia-forense.webp";
import facuminasGovernancaTi from "@/assets/credentials/facuminas-governanca-ti.webp";

/**
 * Arquivo de Formação & Credenciais: fase E2.3 (borrão localizado, não mais tarja preta). Toda
 * evidência é imagem (nunca mais um PDF nativo do navegador). As três credenciais com dado pessoal
 * sensível (FAM, UNIVERSO, CFT) entram como derivados SANITIZADOS — a página relevante do original
 * renderizada e com APENAS os valores sensíveis (datas de nascimento, naturalidade, números de
 * RG/CPF/identidade, filiação, foto, assinaturas manuscritas, QR de verificação) borrados de forma
 * destrutiva no próprio pixel (Gaussian blur assado no raster, nunca uma caixa de CSS por cima) —
 * o resto do documento (instituição, título, texto público, moldura, cores) permanece visualmente
 * igual ao original. Os documentos originais são mantidos fora do repositório. `sanitized: true`
 * identifica as credenciais cujo documento publicado teve informação pessoal removida — a seção
 * usa essa marca (nunca o nome do arquivo) para decidir
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
  /** Nível/modalidade acadêmica (ex.: "Pós-graduação Lato Sensu · Especialista"), quando o
   * documento o declara explicitamente — distingue pós-graduação de graduação dentro do mesmo
   * filtro "academic", sem precisar de uma categoria/filtro novo. */
  level?: string;
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
 * Chave cronológica (mais antigo → mais recente), calculada só a partir de datas reais do
 * documento — nunca da posição no array (que neste arquivo não carrega mais significado
 * editorial nenhum). Prioriza `issueDate` (dia exato, formato DD/MM/AAAA); sem `issueDate`, usa
 * `endYear`/`startYear` (ano de conclusão de um curso plurianual, como FAM/UNIVERSO) — o mês/dia
 * usado nesses casos é só um desempate interno (fim do ano para `endYear`, início para
 * `startYear`), nunca um valor inventado e exibido na tela: a UI continua mostrando apenas o ano
 * verdadeiro (`period()`, em EducationSection.tsx). Entre datas idênticas (ex.: as quatro
 * pós-graduações FACUMINAS, todas 2025 — mesma data de emissão, 07/04/2025, não documentada em
 * detalhe maior que o ano em `endYear`), o desempate é a ordem de declaração abaixo (a mesma do
 * texto de Trajetória: Inteligência Artificial, Business Intelligence, Perícia Forense,
 * Governança) — o sort do JavaScript é estável (ECMA2019+), então isso é determinístico, não
 * arbitrário.
 */
export function credentialSortKey(entry: Credential): number {
  if (entry.issueDate) {
    const [day, month, year] = entry.issueDate.split("/").map(Number);
    return year * 10000 + month * 100 + day;
  }
  if (entry.endYear) return entry.endYear * 10000 + 1231;
  if (entry.startYear) return entry.startYear * 10000 + 101;
  return 0;
}

/**
 * Nenhuma hierarquia editorial aqui: a ordem de exibição é sempre cronológica (mais antigo →
 * mais recente, por `credentialSortKey`), independente do tipo — uma pós-graduação não entra
 * antes de uma graduação só por ter nível acadêmico mais alto. A ordem de declaração abaixo só
 * importa como desempate estável entre datas idênticas (ver `credentialSortKey`).
 */
export const credentials: readonly Credential[] = [
  {
    id: "facuminas-inteligencia-artificial",
    type: "academic",
    institution: "Faculdade Facuminas de Pós-Graduação",
    title: "Inteligência Artificial",
    level: "Pós-graduação Lato Sensu · Especialista",
    startYear: 2024,
    endYear: 2025,
    sanitized: true,
    document: {
      kind: "webp",
      image: facuminasInteligenciaArtificial,
      captionId: "credential.facuminasInteligenciaArtificial",
      alt: "Certificado de Pós-Graduação em Inteligência Artificial, Faculdade Facuminas de Pós-Graduação, com dados pessoais borrados",
    },
  },
  {
    id: "facuminas-business-intelligence",
    type: "academic",
    institution: "Faculdade Facuminas de Pós-Graduação",
    title: "Business Intelligence",
    level: "Pós-graduação Lato Sensu · Especialista",
    startYear: 2024,
    endYear: 2025,
    sanitized: true,
    document: {
      kind: "webp",
      image: facuminasBusinessIntelligence,
      captionId: "credential.facuminasBusinessIntelligence",
      alt: "Certificado de Pós-Graduação em Business Intelligence, Faculdade Facuminas de Pós-Graduação, com dados pessoais borrados",
    },
  },
  {
    id: "facuminas-pericia-forense-computacional",
    type: "academic",
    institution: "Faculdade Facuminas de Pós-Graduação",
    title: "Perícia Forense Computacional",
    level: "Pós-graduação Lato Sensu · Especialista",
    startYear: 2024,
    endYear: 2025,
    sanitized: true,
    document: {
      kind: "webp",
      image: facuminasPericiaForense,
      captionId: "credential.facuminasPericiaForense",
      alt: "Certificado de Pós-Graduação em Perícia Forense Computacional, Faculdade Facuminas de Pós-Graduação, com dados pessoais borrados",
    },
  },
  {
    id: "facuminas-governanca-gestao-ti",
    type: "academic",
    institution: "Faculdade Facuminas de Pós-Graduação",
    title: "Governança e Gestão de TI",
    level: "Pós-graduação Lato Sensu · Especialista",
    startYear: 2024,
    endYear: 2025,
    sanitized: true,
    document: {
      kind: "webp",
      image: facuminasGovernancaTi,
      captionId: "credential.facuminasGovernancaTi",
      alt: "Certificado de Pós-Graduação em Governança e Gestão de TI, Faculdade Facuminas de Pós-Graduação, com dados pessoais borrados",
    },
  },
  {
    id: "fam-analise-desenvolvimento-sistemas",
    type: "academic",
    institution: "Centro Universitário das Américas — FAM",
    title: "Análise e Desenvolvimento de Sistemas",
    area: "Tecnologia da Informação",
    endYear: 2024,
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

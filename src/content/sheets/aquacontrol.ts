import type { StaticImageData } from "next/image";
import absences from "@/assets/aquacontrol/absences.webp";
import adminManagement from "@/assets/aquacontrol/admin-management.webp";
import assignments from "@/assets/aquacontrol/assignments.webp";
import flowMeasurements from "@/assets/aquacontrol/flow-2-measurements.webp";
import flowMedia from "@/assets/aquacontrol/flow-4-media.webp";
import flowPool from "@/assets/aquacontrol/flow-1-pool.webp";
import flowReview from "@/assets/aquacontrol/flow-5-review.webp";
import flowSafetyDialog from "@/assets/aquacontrol/flow-3-safety-dialog.webp";
import flowTasks from "@/assets/aquacontrol/flow-3-tasks.webp";
import pools from "@/assets/aquacontrol/pools.webp";
import reports from "@/assets/aquacontrol/reports.webp";
import supervisorHome from "@/assets/aquacontrol/supervisor-home.webp";
import technicianHome from "@/assets/aquacontrol/technician-home.webp";
import visits from "@/assets/aquacontrol/visits.webp";
import type { Crop } from "./types";
import type { ProjectSlug } from "../projects";

/**
 * Uma captura REAL do AquaControl e o recorte que a apresenta. O recorte é só de
 * apresentação (CSS): o arquivo não é editado. `narrow` é o recorte usado em coluna estreita
 * (celular), para a interface não encolher até o texto perder o sentido.
 */
export type ProductShotData = {
  readonly image: StaticImageData;
  readonly crop: Crop;
  readonly narrow?: Crop;
};

export type AquaSheetData = {
  slug: ProjectSlug;
  name: string;
  year: string;
  media: {
    /** Abertura: painel do técnico (dominante) e lista de visitas (sobreposta). */
    hero: { main: ProductShotData; back: ProductShotData };
    /** Os cinco momentos do fluxo de visita de nove passos, todos com a mesma proporção. */
    flow: readonly [
      ProductShotData,
      ProductShotData,
      ProductShotData,
      ProductShotData,
      ProductShotData,
    ];
    /** Diálogo de segurança, sobreposto ao terceiro momento. */
    flowInset: ProductShotData;
    /** Técnico, supervisão e administração, nesta ordem. */
    roles: readonly [ProductShotData, ProductShotData, ProductShotData];
    /** Atribuições (dominante), ausências e relatórios. */
    management: readonly [ProductShotData, ProductShotData, ProductShotData];
  };
};

/*
 * Fonte das capturas: tablet Android em paisagem (2560×1600), app REAL com dados 100% fictícios
 * (cópia demo isolada; ver o relatório de aquisição). Os PNG mestres ficam em
 * `IMG rg/aquacontrol-captures/`; aqui estão cópias WebP sem perda, com as mesmas dimensões, então
 * as coordenadas de recorte abaixo valem para os dois.
 *
 * Todos os recortes começam abaixo da barra de status do Android (y = 56) e terminam antes da
 * barra de gestos (y <= 1552): só o app aparece, sem a moldura do sistema. Nada é retocado.
 *
 * Selecionadas 14 das 33 capturas. Rejeitadas: 05a, 05c, 05d (telas quase vazias que repetem o
 * que 05 e 05b já mostram), 06b e 07b (repetem a revisão), 08 e 10c e 12 (listas de baixo sinal),
 * 09b, 11 e 11e (estados intermediários), 13 a 15 (a galeria de fotos usa imagens abstratas com
 * o rótulo de demonstração cortado, o que soa artificial), 16, 17, 18, 19b (repetem o que já
 * aparece). Ver o relatório da Fase 2B.
 */
const APP_TOP = 56;

/** A região do aplicativo nas capturas (sem a barra de status e a de gestos do Android): o que o visualizador mostra. */
export const appRegion: Crop = { x: 0, y: APP_TOP, w: 2560, h: 1496 };

export const aquacontrol: AquaSheetData = {
  slug: "aquacontrol",
  name: "AquaControl",
  year: "2026",
  media: {
    hero: {
      main: {
        image: technicianHome,
        crop: { x: 0, y: APP_TOP, w: 2560, h: 1496 },
        narrow: { x: 0, y: APP_TOP, w: 1500, h: 1000 },
      },
      back: { image: visits, crop: { x: 0, y: APP_TOP, w: 2560, h: 1496 } },
    },
    flow: [
      { image: flowPool, crop: { x: 0, y: APP_TOP, w: 1800, h: 1200 }, narrow: { x: 0, y: APP_TOP, w: 1200, h: 1200 } },
      { image: flowMeasurements, crop: { x: 0, y: APP_TOP, w: 1800, h: 1200 }, narrow: { x: 0, y: APP_TOP, w: 1200, h: 1200 } },
      { image: flowTasks, crop: { x: 0, y: APP_TOP, w: 1800, h: 1200 }, narrow: { x: 0, y: APP_TOP, w: 1200, h: 1200 } },
      // O recorte desce até as categorias e aos arquivos anexados, sem o aviso do topo.
      { image: flowMedia, crop: { x: 0, y: 250, w: 1800, h: 1200 }, narrow: { x: 0, y: 250, w: 1200, h: 1200 } },
      { image: flowReview, crop: { x: 0, y: APP_TOP, w: 1800, h: 1200 }, narrow: { x: 0, y: APP_TOP, w: 1200, h: 1200 } },
    ],
    // O diálogo ocupa x 732–1828 e y 541–1041 da captura; o recorte deixa uma pequena margem.
    flowInset: { image: flowSafetyDialog, crop: { x: 684, y: 511, w: 1192, h: 560 } },
    roles: [
      { image: pools, crop: { x: 0, y: APP_TOP, w: 1800, h: 1350 } },
      { image: supervisorHome, crop: { x: 0, y: APP_TOP, w: 1800, h: 1350 } },
      { image: adminManagement, crop: { x: 0, y: APP_TOP, w: 1800, h: 1350 } },
    ],
    management: [
      { image: assignments, crop: { x: 0, y: APP_TOP, w: 2560, h: 1050 }, narrow: { x: 0, y: APP_TOP, w: 1700, h: 1000 } },
      // Título do mês, dias da semana e as ausências marcadas (11 e 12 de setembro): x 1120–2243, y 850–1552.
      { image: absences, crop: { x: 1120, y: 850, w: 1123, h: 702 } },
      { image: reports, crop: { x: 0, y: APP_TOP, w: 1800, h: 1125 } },
    ],
  },
};

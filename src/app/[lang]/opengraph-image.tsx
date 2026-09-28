import { ImageResponse } from "next/og";
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const alt = "Rogério Gomes — x7rG Enterprise, Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Prévia social gerada por código, sem ativo binário próprio: reaproveita a marca x7rG
 * (o mesmo grid de icon.svg) e a paleta aprovada do site (fundo --color-bg, texto
 * --color-ink, o dourado #CC9149 do NeonBorder — literal aqui porque o Satori não lê
 * variáveis CSS).
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#0f0f0f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="36" height="36" viewBox="0 0 32 32">
            <rect x="6" y="6" width="9" height="9" fill="#ece8de" />
            <rect x="17" y="6" width="9" height="9" fill="#a2a4a6" />
            <rect x="6" y="17" width="9" height="9" fill="#ece8de" />
            <rect x="17" y="17" width="9" height="9" fill="#a2a4a6" />
          </svg>
          <span
            style={{
              color: "#CC9149",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            x7rG Enterprise
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              color: "#f3f0e8",
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Rogério Gomes
          </span>
          <span style={{ color: "rgba(243, 240, 232, 0.72)", fontSize: 34, fontWeight: 400 }}>
            Developer × Graphic Designer
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 64, height: 2, background: "#CC9149" }} />
          <span
            style={{
              color: "#CC9149",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const alt = "Rogério Gomes — x7rG Enterprise, Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const portraitData = await readFile(join(process.cwd(), "src/assets/portrait/rogerio-gomes.jpeg"), "base64");
const portraitSrc = `data:image/jpeg;base64,${portraitData}`;

/**
 * Prévia social: a mesma dupla foto + painel do ProfilePanel, com a paleta aprovada do
 * site (fundo --color-bg, texto --color-ink, o dourado #CC9149 do NeonBorder — literal
 * aqui porque o Satori não lê variáveis CSS).
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f0f0f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 480, height: "100%", display: "flex", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitSrc}
            width={480}
            height={630}
            style={{ objectFit: "cover", objectPosition: "54% 20%" }}
            alt=""
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background: "linear-gradient(to right, rgba(15,15,15,0) 60%, rgba(15,15,15,1) 100%)",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 72px 72px 24px",
          }}
        >
          <span
            style={{
              color: "#CC9149",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            x7rG Enterprise
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span
              style={{
                color: "#f3f0e8",
                fontSize: 72,
                fontWeight: 600,
                letterSpacing: -1.5,
                lineHeight: 1.05,
              }}
            >
              Rogério Gomes
            </span>
            <span style={{ color: "rgba(243, 240, 232, 0.72)", fontSize: 28, fontWeight: 400 }}>
              Developer × Graphic Designer
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 2, background: "#CC9149" }} />
            <span
              style={{
                color: "#CC9149",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

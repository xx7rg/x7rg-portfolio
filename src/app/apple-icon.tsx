import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
// Exigido por output: "export" (Cloudflare): confirma que a rota é estática.
export const dynamic = "force-static";

const shieldData = await readFile(join(process.cwd(), "src/assets/brand/history/x7rg-shield.png"), "base64");
const shieldSrc = `data:image/png;base64,${shieldData}`;

/** Ícone para a tela inicial do iOS: mesmo escudo dourado, em tamanho maior. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0f",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shieldSrc} width={150} height={150} style={{ objectFit: "contain" }} alt="" />
      </div>
    ),
    { ...size },
  );
}

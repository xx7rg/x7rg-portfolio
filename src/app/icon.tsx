import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
// Exigido por output: "export" (Cloudflare): confirma que a rota é estática.
export const dynamic = "force-static";

const shieldData = await readFile(join(process.cwd(), "src/assets/brand/history/x7rg-shield.png"), "base64");
const shieldSrc = `data:image/png;base64,${shieldData}`;

/** Ícone da aba do navegador: o escudo dourado x7rG (o mesmo do Hero), reduzido para favicon. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shieldSrc} width={56} height={56} style={{ objectFit: "contain" }} alt="" />
      </div>
    ),
    { ...size },
  );
}

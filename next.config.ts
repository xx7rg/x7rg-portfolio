import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportação estática (Cloudflare Pages): sem servidor Node, então nem a otimização de
  // imagem em runtime (unoptimized) nem redirects() de next.config funcionam — o redirect
  // "/ -> /pt" virou public/_redirects.
  output: "export",
  images: {
    unoptimized: true,
    // 75 é o padrão; 90 é para as capturas do jogo, onde o texto mono pequeno perde nitidez com 75.
    // 70/80/85 são usados por outras capturas de projeto (Adriano, Moon, faixas fechadas, etc.).
    // Mantido mesmo com unoptimized: se a exportação estática for revertida, os valores já usados no código continuam declarados.
    qualities: [70, 75, 80, 85, 90],
  },
};

export default nextConfig;

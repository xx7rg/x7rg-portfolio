import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 é o padrão; 90 é para as capturas do jogo, onde o texto mono pequeno perde nitidez com 75.
    // 70/80/85 são usados por outras capturas de projeto (Adriano, Moon, faixas fechadas, etc.).
    qualities: [70, 75, 80, 85, 90],
  },
  async redirects() {
    return [
      // Idioma padrão: português. Mantém em sincronia com defaultLocale (src/i18n/config.ts).
      // 307, porque a escolha do idioma padrão pode mudar.
      { source: "/", destination: "/pt", permanent: false },
    ];
  },
};

export default nextConfig;

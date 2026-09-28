import Image from "next/image";
import portrait from "@/assets/portrait/rogerio-gomes.jpeg";
import { ArrowDownIcon, ArrowUpRightIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/icons";
import { contact } from "@/content/contact";
import type { Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./profile-panel.module.css";

const socials = [
  { name: "GitHub", href: contact.github, Icon: GithubIcon },
  { name: "LinkedIn", href: contact.linkedin, Icon: LinkedinIcon },
  { name: "Instagram", href: contact.instagram, Icon: InstagramIcon },
] as const;

/**
 * Painel pessoal: a fotografia é a interface. Ocupa o painel inteiro, com um
 * gradiente escuro embaixo e o conteúdo (estado, saudação, apresentação e ações)
 * sobreposto a ela, dentro de uma moldura de vidro. A foto original é usada sem
 * edição: o recorte é só de apresentação (a imagem é maior que o painel e ancorada
 * no topo, o que deixa de fora os tênis e mantém o rosto grande).
 * No desktop fica fixo à esquerda; no tablet e no celular é um cartão centralizado.
 */
export function ProfilePanel({ dict }: { dict: Dictionary }) {
  const { profile, a11y } = dict;

  return (
    <aside className={styles.panel} aria-label="Rogério Gomes">
      <div className={cx(styles.frame, "glass")}>
        <div className={styles.inner}>
          <div className={styles.photo}>
            <Image
              src={portrait}
              alt={profile.portraitAlt}
              fill
              preload
              sizes="(min-width: 1100px) 32vw, 400px"
              className={styles.image}
            />
          </div>
          <div className={styles.shade} aria-hidden="true" />

          {/* Assinatura discreta do autor. Decorativa: o nome já está no texto da página. */}
          <span className={styles.signature} aria-hidden="true">
            x7rG
          </span>

          <ul className={styles.social} aria-label={a11y.socialNav}>
            {socials.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  className={cx(styles.socialLink, "glass")}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name}, ${a11y.newTab}`}
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.info}>
            <a className={styles.status} href="#neon-blockfall">
              <span className={styles.dot} aria-hidden="true" />
              {profile.status}
            </a>
            <p className={styles.greeting}>{profile.greeting}</p>
            <p className={styles.intro}>{profile.intro}</p>

            <div className={styles.actions}>
              <a className={styles.cta} href={`mailto:${contact.email}`}>
                <span className={styles.ctaCircle} aria-hidden="true">
                  <ArrowUpRightIcon />
                </span>
                <span className={styles.ctaLabel}>{profile.cta}</span>
              </a>
              <a className={styles.more} href="#projects">
                <ArrowDownIcon />
                {profile.projectsLink}
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

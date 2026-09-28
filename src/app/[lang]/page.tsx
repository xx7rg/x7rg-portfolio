import { notFound } from "next/navigation";
import { AboutSection } from "@/components/about/AboutSection";
import { BrandStorySection } from "@/components/brand-story/BrandStorySection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Hero } from "@/components/hero/Hero";
import { JourneySection } from "@/components/journey/JourneySection";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import styles from "./home.module.css";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  // O painel vem primeiro no DOM (fica à esquerda no desktop e no topo no celular).
  return (
    <div className={styles.home}>
      <ProfilePanel dict={dict} />
      <div className={styles.content}>
        <Hero dict={dict} />
        <ProjectsSection dict={dict} />
        <AboutSection dict={dict} />
        <BrandStorySection dict={dict} />
        <JourneySection dict={dict} />
        <ContactSection dict={dict} />
      </div>
    </div>
  );
}

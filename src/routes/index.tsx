import { createFileRoute } from "@tanstack/react-router";
import { useSectionMotion } from "@/hooks/use-section-motion";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Clients from "@/components/landing/Clients";
import Ecosystem from "@/components/landing/Ecosystem";
import Authority from "@/components/landing/Authority";
import Liga from "@/components/landing/Liga";
import Services from "@/components/landing/Services";
import Numbers from "@/components/landing/Numbers";
import CTA from "@/components/landing/CTA";
import Events from "@/components/landing/Events";
import Careers from "@/components/landing/Careers";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import CookieConsent from "@/components/landing/CookieConsent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTF. Blue Trust Force | Transformação Digital & Salesforce" },
      { name: "description", content: "Ecossistema de especialistas em Salesforce, IA, Segurança e Governança de TI. Tecnologia estratégica que transforma desafios complexos em valor de negócio." },
      { property: "og:title", content: "BTF. Blue Trust Force | Transformação Digital & Salesforce" },
      { property: "og:description", content: "Ecossistema de especialistas em Salesforce, IA, Segurança e Governança de TI. Tecnologia estratégica que transforma desafios complexos em valor de negócio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useSectionMotion();
  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Ecosystem />
        <Authority />
        <Liga />
        <Services />
        <Numbers />
        <CTA />
        <Events />
        <Careers />
        <FAQ />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

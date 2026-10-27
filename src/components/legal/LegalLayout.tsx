import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CookieConsent from "@/components/landing/CookieConsent";

type Props = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

const LegalLayout = ({ title, updatedAt, children }: Props) => {
  const { t } = useTranslation();
  return (
  <div className="min-h-[100dvh] bg-background text-foreground">
    <Navbar />
    <main className="container mx-auto w-full max-w-3xl px-5 sm:px-6 pt-28 md:pt-32 pb-16 md:pb-20">
      <Link to="/" className="text-xs uppercase tracking-[0.25em] text-primary-glow hover:underline">
        BTF. Blue Trust Force
      </Link>
      <h1 className="mt-4 font-display font-bold text-[clamp(1.75rem,6vw,3rem)] leading-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t("legal.updatedLabel")} {updatedAt}</p>
      <div className="legal-prose mt-8 md:mt-10 space-y-6 text-base text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-[clamp(1.125rem,4vw,1.5rem)] [&_h2]:font-semibold [&_h2]:pt-4 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:sm:pl-6 [&_ul]:space-y-2 [&_ul_ul]:mt-2 [&_ul_ul]:pl-4">
        {children}
      </div>
    </main>
    <Footer />
    <CookieConsent />
  </div>

  );
};

export default LegalLayout;

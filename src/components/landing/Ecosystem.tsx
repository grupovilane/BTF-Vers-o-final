import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/landing/SectionHeader";

const Ecosystem = () => {
  const { t } = useTranslation();

  const capabilities = t("ecosystem.capabilities", { returnObjects: true }) as string[];
  const highlights = t("ecosystem.highlights", { returnObjects: true }) as { t: string, d: string }[];

  return (
    <section id="quem-somos" className="pt-12 md:pt-20 pb-12 md:pb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl animate-fade-up">
          <SectionHeader
            className="mb-12"
            label={t("ecosystem.tag")}
            title={t("ecosystem.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")}
            description={<div className="space-y-6">{t("ecosystem.desc1").split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>}
          />

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-20">
            {capabilities.map((c) => (
              <div key={c} className="flex items-center gap-3 text-sm md:text-base text-muted-foreground/80 group">
                <CheckCircle2 className="w-5 h-5 text-primary-glow shrink-0 transition-transform group-hover:scale-110" /> 
                <span className="group-hover:text-foreground transition-colors">{c}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h) => (
              <div 
                key={h.t} 
                className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 group"
              >
                <div className="text-xl font-bold text-brand-gradient mb-2 group-hover:translate-x-1 transition-transform">
                  {h.t}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {h.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Ecosystem);
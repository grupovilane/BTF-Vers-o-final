import circuit from "@/assets/circuit.webp";
import iconSenioridade from "@/assets/icons/authority/senioridade.webp";
import iconResultados from "@/assets/icons/authority/resultados.webp";
import iconVisaoIntegrada from "@/assets/icons/authority/visao-integrada.webp";
import iconPrevisibilidade from "@/assets/icons/authority/previsibilidade.webp";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/landing/SectionHeader";

const Authority = () => {
  const { t } = useTranslation();

  const diffs = [
    { icon: iconSenioridade, t: t("authority.diffs.0.t"), d: t("authority.diffs.0.d") },
    { icon: iconResultados, t: t("authority.diffs.1.t"), d: t("authority.diffs.1.d") },
    { icon: iconVisaoIntegrada, t: t("authority.diffs.2.t"), d: t("authority.diffs.2.d") },
    { icon: iconPrevisibilidade, t: t("authority.diffs.3.t"), d: t("authority.diffs.3.d") },
  ];

  const cases = t("authority.cases", { returnObjects: true }) as { kpi: string, label: string }[];

  return (
    <section id="autoridade" className="pt-12 md:pt-16 pb-14 md:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-10">
        <img src={circuit} alt="" aria-hidden="true" loading="lazy" decoding="async" width={1600} height={900} className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader className="mb-20" label={t("authority.tag")} title={t("authority.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")} description={t("authority.desc")} />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {diffs.map((d) => (
            <div 
              key={d.t} 
              className="group p-10 rounded-3xl glass border border-white/5 hover:border-primary/40 hover:bg-white/[0.02] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-start text-left h-full min-h-[340px] relative overflow-hidden hover:-translate-y-2 hover:shadow-elegant"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_rgba(0,142,208,0.4)] transition-all duration-500">
                <img src={d.icon} alt="" aria-hidden="true" className="w-9 h-9 object-contain" loading="lazy" decoding="async" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-primary-glow transition-colors duration-300">{d.t}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{d.d}</p>
              
              <div className="mt-auto pt-10">
                <div className="w-10 h-0.5 bg-primary/20 group-hover:w-20 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-8">
          {cases.map((c, idx) => (
            <div 
              key={idx}
              className="group p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col sm:flex-row items-start sm:items-center gap-8 hover:bg-white/[0.04]"
            >
              <div className="font-display text-5xl font-bold text-brand-gradient shrink-0 min-w-[140px] tracking-tighter">
                {c.kpi}
              </div>
              <div className="w-px h-16 bg-white/10 hidden sm:block" />
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                {c.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Authority;

import { GanttChart } from "lucide-react";
import iconCloud from "@/assets/icons/services/cloud.webp";
import iconIaAutomacao from "@/assets/icons/services/ia-automacao.webp";
import iconSeguranca from "@/assets/icons/services/seguranca.webp";
import iconArquitetura from "@/assets/icons/services/arquitetura.webp";
import iconAgilPmo from "@/assets/icons/services/agil-pmo.webp";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/landing/SectionHeader";

const Services = () => {
  const { t } = useTranslation();

  const services = t("services.items", { returnObjects: true }) as { title: string, desc: string }[];

  // Ícones customizados (imagem); "Transformação Digital" mantém o ícone lucide por não ter um customizado ainda.
  const icons = [iconCloud, iconIaAutomacao, iconSeguranca, iconArquitetura, null, iconAgilPmo];

  // "Uma única tese de valor: resultado." vem marcado com <0> na tradução;
  // extraímos para exibir como descrição abaixo do título, não colado nele.
  const rawTitle = t("services.title", { interpolation: { escapeValue: false } });
  const titleMatch = rawTitle.match(/^(.*?)<0>(.*)<\/0>$/s);
  const titleMain = (titleMatch?.[1] ?? rawTitle.replace(/<\/?0>/g, "")).trim();
  const titleSub = titleMatch?.[2]?.trim();

  return (
    <section id="servicos" className="py-14 md:py-20 relative">
      <div className="absolute inset-0 bg-secondary/10 -z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          className="mb-20"
          label={t("services.tag")}
          title={titleMain}
          description={
            <>
              <p>{titleSub}</p>
              <p className="mt-2">{t("services.desc")}</p>
            </>
          }
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, idx) => {
            const iconSrc = icons[idx];
            return (
              <div
                key={s.title}
                className="group p-10 rounded-3xl bg-gradient-card border border-white/5 hover:border-primary/40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-elegant relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                <div className="w-14 h-14 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-smooth relative z-10">
                  {iconSrc ? (
                    <img src={iconSrc} alt="" aria-hidden="true" className="w-9 h-9 object-contain" loading="lazy" decoding="async" />
                  ) : (
                    <GanttChart className="w-7 h-7 text-primary-glow" />
                  )}
                </div>

                <h3 className="section-subtitle relative z-10 group-hover:text-primary-glow transition-colors">{s.title}</h3>
                <p className="section-body text-muted-foreground relative z-10">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

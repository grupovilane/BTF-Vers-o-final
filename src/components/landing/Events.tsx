import { useState } from "react";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/landing/SectionHeader";

const events = [
  { name: "SEMCOMP 2026: Semana de Computação", day: "24 – 28", month: 7, endDate: "2026-08-28", mode: "presencial", place: "Salvador, BA", url: "https://www.semcomp.com.br/" },
  { name: "TDC Experience São Carlos", day: "26 – 27", month: 7, endDate: "2026-08-27", mode: "hibrido", place: "São Carlos, SP", url: "https://thedevconf.com/tdc/2026/index.html" },
  { name: "Simpósio Brasileiro de Cibersegurança 2026", day: "01", month: 8, endDate: "2026-09-01", mode: "presencial", place: "Armação dos Búzios, RJ", url: "https://www.sbseg2026.uff.br/" },
  { name: "Gophercon LATAM 2026", day: "02 – 04", month: 8, endDate: "2026-09-04", mode: "presencial", place: "Florianópolis, SC", url: "https://gopherconlatam.org/" },
  { name: "CBSOFT'26: Congresso Brasileiro de Software", day: "08 – 11", month: 8, endDate: "2026-09-11", mode: "hibrido", place: "São Paulo, SP", url: "https://cbsoft.sbc.org.br/2026/pt/" },
  { name: "TDC São Paulo", day: "23 – 25", month: 8, endDate: "2026-09-25", mode: "hibrido", place: "São Paulo, SP", url: "https://thedevconf.com/tdc/2026/index.html" },
  { name: "Python Brasil 2026", day: "14", month: 9, endDate: "2026-10-14", mode: "presencial", place: "Florianópolis, SC", url: "https://2026.pythonbrasil.org.br/" },
  { name: "TDC Experience Recife | Rec'n'Play", day: "11 – 12", month: 10, endDate: "2026-11-12", mode: "hibrido", place: "Recife, PE", url: "https://thedevconf.com/tdc/2026/index.html" },
];

const Events = () => {
  const { t } = useTranslation();
  const months = t("events.months", { returnObjects: true }) as string[];
  const [showAll, setShowAll] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date(`${e.endDate}T23:59:59`) >= today);
  const visible = showAll ? upcoming : upcoming.slice(0, 12);
  const hasMore = !showAll && upcoming.length > 12;


  return (
    <section id="eventos" className="py-10 md:py-14 relative">
      <div className="container mx-auto px-6">
        <SectionHeader
          className="mb-14"
          label={t("events.tag")}
          title={t("events.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")}
          description={t("events.desc", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")}
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-4">
          {visible.map((e) => (
            <li key={e.name} className="h-full">
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col p-5 rounded-2xl bg-gradient-card border border-border/60 hover:border-primary/50 transition-smooth"
              >
                <div className="flex items-center gap-2 text-primary-glow">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.04em] text-brand-gradient">
                    {`${e.day} ${months[e.month]}`}
                  </span>
                </div>
                <h3 className="mt-3 font-display font-semibold text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.3] line-clamp-2 group-hover:text-primary-glow transition-smooth">
                  {e.name}
                  <ArrowUpRight className="inline w-4 h-4 ml-1 opacity-60" />
                </h3>
                <p className="mt-auto pt-4 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {e.place}
                  <span className="text-xs uppercase tracking-[0.04em] px-2 py-0.5 rounded-md bg-secondary/60 border border-border">
                    {t(`events.modes.${e.mode}`)}
                  </span>
                </p>
              </a>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="min-h-[44px] px-6 rounded-xl border border-border/70 bg-card/50 text-sm font-medium hover:border-primary/50 hover:text-primary-glow transition-smooth"
            >
              {t("events.seeAll", "Ver todos")}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default Events;

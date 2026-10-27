import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/landing/SectionHeader";

// Anima de 0 até o valor definido quando o card entra na tela.
// Preserva prefixo/sufixo não numéricos do texto original (ex: "+", "%").
function useCountUp(raw: string, active: boolean) {
  const match = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match?.[2] ? parseFloat(match[2].replace(",", ".")) : NaN;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2] && /[.,]/.test(match[2]) ? 1 : 0;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const duration = 1600;
    const start = performance.now();
    const ease = (p: number) => 1 - Math.pow(1 - p, 3);
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  if (Number.isNaN(target)) return raw;
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

const StatCard = ({ s, active }: { s: { v: string; t: string; d: string }; active: boolean }) => {
  const display = useCountUp(s.v, active);
  return (
    <div className="p-7 rounded-2xl bg-gradient-card border border-border/40 hover:border-primary/30 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-card-soft hover:-translate-y-1.5 hover:shadow-elegant">
      <div className="font-display text-4xl md:text-5xl font-bold text-brand-gradient tabular-nums">{display}</div>
      <div className="mt-2 font-display font-semibold">{s.t}</div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
    </div>
  );
};

const Numbers = () => {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const stats = t("numbers.stats", { returnObjects: true }) as { v: string, t: string, d: string }[];

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="numeros" className="py-10 md:py-14 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader className="mb-14" label={t("numbers.tag")} title={t("numbers.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")} description={t("numbers.desc")} />

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <StatCard key={s.t} s={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Numbers;

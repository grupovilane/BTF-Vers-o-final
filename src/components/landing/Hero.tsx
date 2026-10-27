import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";

function useDissolve(
  figureRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const fig = figureRef.current;
    const cv = canvasRef.current;
    if (!fig || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0,
      h = 0,
      raf = 0;
    type Bit = {
      x: number;
      y: number;
      s: number;
      vy: number;
      vx: number;
      a: number;
      d: number;
    };
    let bits: Bit[] = [];

    const spawn = (rand: boolean): Bit => {
      const isRight = Math.random() > 0.5;
      return {
        x: isRight ? w * (0.58 + Math.random() * 0.3) : w * (0.1 + Math.random() * 0.3),
        y: rand ? Math.random() * h : h * (0.25 + Math.random() * 0.6),
        s: Math.random() * 3 + 1.2,
        vy: -(Math.random() * 0.5 + 0.15),
        vx: isRight ? Math.random() * 0.55 + 0.12 : -(Math.random() * 0.55 + 0.12),
        a: Math.random() * 0.7 + 0.2,
        d: Math.random() * 0.004 + 0.0015,
      };
    };

    const size = () => {
      const r = fig.getBoundingClientRect();
      w = cv.width = Math.max(1, r.width);
      h = cv.height = Math.max(1, r.height);
      cv.style.width = `${r.width}px`;
      cv.style.height = `${r.height}px`;
      const n = window.innerWidth < 760 ? 60 : 260;
      bits = Array.from({ length: n }, () => spawn(true));
    };
    size();

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < bits.length; i++) {
        const b = bits[i];
        if (!b) continue;
        b.x += b.vx;
        b.y += b.vy;
        b.a -= b.d;
        if (b.a <= 0 || b.x > w || b.x < 0 || b.y < 0) {
          bits[i] = spawn(false);
          continue;
        }
        ctx.fillStyle = `rgba(${
          Math.random() > 0.5 ? "0,186,228," : "0,142,208,"
        }${b.a.toFixed(2)})`;
        ctx.fillRect(b.x, b.y, b.s, b.s);
      }
      raf = requestAnimationFrame(loop);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !raf) {
            raf = requestAnimationFrame(loop);
          } else if (!entry.isIntersecting && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(fig);

    window.addEventListener("resize", size);
    // O loop é iniciado pelo IntersectionObserver: evita concorrer com o LCP no primeiro paint.

    return () => {
      obs.disconnect();
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
    };
  }, [figureRef, canvasRef]);
}

const Hero = () => {
  const { t } = useTranslation();
  const figureRef = useRef<HTMLDivElement>(null);
  const dissolveRef = useRef<HTMLCanvasElement>(null);
  useDissolve(figureRef, dissolveRef);

  return (
    <section aria-labelledby="hero-title" className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-x-clip">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <picture>
          <source
            type="image/avif"
            srcSet="/img/hero-bg-768.avif 768w, /img/hero-bg-1280.avif 1280w, /img/hero-bg-1920.avif 1920w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/img/hero-bg-768.webp 768w, /img/hero-bg-1280.webp 1280w, /img/hero-bg-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/img/hero-bg-1280.webp"
            alt=""
            aria-hidden="true"
            width={1920}
            height={1280}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-60"
          />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Círculo de fundo fluido: escala com o viewport (vw) e nunca gera scroll lateral.
            Reduzido para que o brilho fique concentrado no meio da página, sem vazar para o logo/menu no topo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,85vw)] h-[min(500px,85vw)] md:w-[min(750px,55vw)] md:h-[min(750px,55vw)] aspect-square opacity-50 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-primary-glow/40 animate-[spin_60s_linear_infinite] blur-[2px]" />
          <div className="absolute inset-[8%] rounded-full border border-primary-glow/20 animate-[spin_40s_linear_infinite_reverse] opacity-50 blur-[3px]" />
          <div className="absolute inset-[20%] rounded-full border border-primary-glow/10 blur-[4px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary-glow/30 blur-[100px] md:blur-[150px] rounded-full" />
        </div>

      </div>

      <div className="container mx-auto">
        <div
          ref={figureRef}
          className="max-w-4xl lg:max-w-5xl mx-auto text-center animate-fade-up relative z-10"
        >
          <canvas
            ref={dissolveRef}
            className="absolute inset-0 z-[5] pointer-events-none"
            aria-hidden="true"
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass relative z-10 mb-16 lg:mb-8 mt-0 lg:mt-0">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("hero.tag")}
            </span>
          </div>

          {/* Anel tracejado: topo alinhado ao fim do menu (fixo por breakpoint, sem depender de %) */}
          <div aria-hidden="true" className="hidden lg:block absolute left-1/2 top-[-48px] -translate-x-1/2 w-[min(950px,84vw)] h-[min(950px,84vw)] rounded-full border border-[#00BAE4]/30 shadow-[inset_0_0_150px_rgba(0,142,208,0.15)] blur-[2px]">
            <div className="absolute inset-[14%] rounded-full border border-dashed border-[#00BAE4]/20 animate-[btf-spin_45s_linear_infinite] blur-[1px]" />
            {/* Luz pulsante: sempre no centro exato da orbe, qualquer que seja a posição do anel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary-glow/50 blur-2xl animate-pulse-slow pointer-events-none" />
          </div>

          {/* Sombra/chão embaixo do efeito */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute bottom-[-2rem] left-1/2 -translate-x-1/2 w-[min(800px,60vw)] h-[8rem] z-[2] blur-[12px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,142,208,.3) 0%, rgba(12,20,67,0) 75%)",
            }}
          />

          {/* Wrapper do headline: em mobile/tablet o orbe vive aqui e acompanha o texto */}
          <div className="relative">
            {/* Orbe mobile: centrado no headline. Orbe tablet (md+): topo alinhado ao fim do menu */}
            <div
              className="lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[-158px] md:translate-y-0 z-0 pointer-events-none w-[115%] max-w-[min(430px,92vw)] sm:max-w-[min(620px,88vw)] aspect-square"
              aria-hidden="true"
            >
              <div
                className="absolute inset-[-12%] rounded-full blur-[40px] animate-[btf-breathe_8s_ease-in-out_infinite]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,142,208,.5) 0%, rgba(0,186,228,.2) 45%, transparent 75%)",
                }}
              />
              <div className="absolute inset-0 rounded-full border border-[#00BAE4]/30 shadow-[inset_0_0_150px_rgba(0,142,208,0.15)] blur-[2px]">
                <div className="absolute inset-[14%] rounded-full border border-dashed border-[#00BAE4]/20 animate-[btf-spin_45s_linear_infinite] blur-[1px]" />
              </div>
              {/* Luz pulsante: reposicionada do topo (perto do logo) para o centro exato da orbe */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-glow/50 blur-xl animate-pulse-slow pointer-events-none" />
            </div>

            {/* Tipografia fluida: escala contínua entre mobile e desktop, sem degraus bruscos */}
            <h1 id="hero-title" className="relative z-10 font-display text-[clamp(1.75rem,8.5vw,2.75rem)] lg:text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.03em] px-4 md:px-0 text-gradient lg:max-w-none max-w-[min(340px,92vw)] sm:max-w-[440px] mx-auto min-h-[220px] lg:min-h-0 flex items-center justify-center">
              <Trans
                i18nKey="hero.title"
                components={{ 0: <span className="text-brand-gradient" /> }}
              />
            </h1>
          </div>

          <p className="relative z-10 mt-10 text-[clamp(0.875rem,4vw,1.125rem)] text-muted-foreground max-w-[320px] sm:max-w-[550px] lg:max-w-2xl mx-auto leading-relaxed px-6 font-light tracking-wide lg:px-4 hidden lg:block">
            <Trans i18nKey="hero.subtitle" />
          </p>

          <div className="relative z-10 mt-8 sm:mt-10 flex flex-col lg:flex-row gap-3 lg:gap-4 items-center justify-center w-full">
            <Button asChild variant="hero" size="sm" className="lg:h-14 lg:rounded-lg lg:px-10 lg:text-base min-h-[44px]">
              <a href="#contato">
                {t("hero.ctaPrimary")} <ArrowRight className="ml-1" />
              </a>
            </Button>
            <Button asChild variant="glow" size="sm" className="lg:h-14 lg:rounded-lg lg:px-10 lg:text-base min-h-[44px]">
              <a href="#servicos">{t("hero.ctaSecondary")}</a>
            </Button>
          </div>

          <div className="relative z-10 mt-24 lg:mt-16 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-6 sm:px-4 lg:px-0">
            {[
              { v: "+15", l: t("hero.stats.exp") },
              { v: "+200", l: t("hero.stats.projects") },
              { v: "98%", l: t("hero.stats.satisfaction") },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">
                  {s.v}
                </div>
                <div className="mt-1 text-xs md:text-sm text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

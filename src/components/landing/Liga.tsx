import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/landing/SectionHeader";

import nexant480 from "@/assets/liga/nexant-480.webp";
import nexant960 from "@/assets/liga/nexant-960.webp";
import abelha480 from "@/assets/liga/abelha-480.webp";
import abelha960 from "@/assets/liga/abelha-960.webp";
import aguia480 from "@/assets/liga/aguia-480.webp";
import aguia960 from "@/assets/liga/aguia-960.webp";
import leao480 from "@/assets/liga/leao-480.webp";
import leao960 from "@/assets/liga/leao-960.webp";
import cavalo480 from "@/assets/liga/cavalo-480.webp";
import cavalo960 from "@/assets/liga/cavalo-960.webp";
import pomba480 from "@/assets/liga/pomba-480.webp";
import pomba960 from "@/assets/liga/pomba-960.webp";
import cordeiro480 from "@/assets/liga/cordeiro-480.webp";
import cordeiro960 from "@/assets/liga/cordeiro-960.webp";
import codorna480 from "@/assets/liga/codorna-480.webp";
import codorna960 from "@/assets/liga/codorna-960.webp";
import peixe480 from "@/assets/liga/peixe-480.webp";
import peixe960 from "@/assets/liga/peixe-960.webp";

// Optical calibration, character by character: measured from each artwork's
// real non-transparent bounding box, so every mascot reads at the same
// perceived size on screen (not the same canvas/file size). Values are a
// uniform scale applied from the bottom, so feet stay grounded.
const charactersData = [
  { name: "NEXANT", src: nexant960, srcSmall: nexant480, scale: 0.95 },
  { name: "BEEYA", src: abelha960, srcSmall: abelha480, scale: 0.98 },
  { name: "AURON", src: aguia960, srcSmall: aguia480, scale: 0.99 },
  { name: "KINGLY", src: leao960, srcSmall: leao480, scale: 0.9 },
  { name: "VECTOR", src: cavalo960, srcSmall: cavalo480, scale: 1.0 },
  { name: "LUMI", src: pomba960, srcSmall: pomba480, scale: 0.95 },
  { name: "RAMMIUS", src: cordeiro960, srcSmall: cordeiro480, scale: 0.98 },
  { name: "PRISMA", src: codorna960, srcSmall: codorna480, scale: 0.95 },
  { name: "FLOW", src: peixe960, srcSmall: peixe480, scale: 0.93 },
];


const Liga = () => {
  const { t } = useTranslation();
  const [[index, direction], setIndex] = useState([0, 0]);

  const characters = charactersData;

  const go = (newDirection: number) => {
    const nextIndex = (index + newDirection + characters.length) % characters.length;
    setIndex([nextIndex, newDirection]);
  };

  const c = characters[index]!;

  const EASE = [0.22, 1, 0.36, 1] as const;

  // Escala alvo embutida nas próprias variants (em vez de um wrapper externo)
  // para que cada mascote anime sempre a partir do/para o seu próprio tamanho,
  // sem "saltar" para a escala do personagem seguinte no início da transição.
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
      scale: c.scale * 0.97,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: c.scale,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
      scale: c.scale * 0.97,
    }),
  };

  return (
    <section id="liga" className="py-14 md:py-20 relative">
      {/* Largura nunca excede o viewport (100vw), então não há necessidade de clipar a seção
          (overflow-hidden cortava o brilho de forma abrupta quando a seção ficou mais baixa) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] aspect-square rounded-full bg-primary/10 blur-[150px] -z-10" />
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          className="mb-4 md:mb-6"
          label={t("liga.tag")}
          title={t("liga.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")}
          description={t("liga.intro.title")}
        />

        <div className="max-w-3xl mb-12 md:mb-16 text-left">
          <div className="space-y-4 section-body text-muted-foreground">
            <p className="whitespace-pre-line">{t("liga.intro.p1")}</p>
            <p>{t("liga.intro.p2")}</p>
            <p>{t("liga.intro.p3")}</p>
          </div>
        </div>


        {/* Carrossel: setas com alvo touch de 44px e mascote com altura fluida (sem cortes) */}
        <div className="relative max-w-6xl mx-auto">
          <p className="sr-only" aria-live="polite">
            {c.name}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-16">

            <div className="flex-1 w-full max-w-sm md:max-w-md relative flex items-center justify-center pb-16 md:pb-0">
              <div className="absolute inset-0 bg-gradient-brand rounded-full blur-[100px] opacity-15 animate-pulse-slow" />
              <div className="relative w-full aspect-[3/4] flex items-end justify-center">
                <div className="absolute inset-0 pointer-events-none">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                      key={c.name}
                      src={c.src}
                      srcSet={`${c.srcSmall} 480w, ${c.src} 960w`}
                      sizes="(max-width: 768px) 90vw, 420px"
                      width={480}
                      height={640}
                      alt={`${c.name}, ${t("liga.altSuffix")}`}

                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      style={{ transformOrigin: "bottom center" }}
                      transition={{
                        x: { duration: 0.6, ease: EASE },
                        opacity: { duration: 0.45, ease: "linear" },
                        scale: { duration: 0.6, ease: EASE },
                      }}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain object-bottom lg:drop-shadow-[0_20px_60px_hsl(210_100%_30%/0.6)]"
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Setas abaixo do personagem: apenas mobile */}
              <div className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t("liga.prev")}
                  className="w-12 h-12 rounded-full grid place-items-center border border-border/70 bg-card/50 text-muted-foreground"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t("liga.next")}
                  className="w-12 h-12 rounded-full grid place-items-center border border-border/70 bg-card/50 text-muted-foreground"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl text-center md:text-left px-2">
              <div className="min-h-[360px] md:min-h-[400px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${c.name}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="w-full"
                  >
                    <h3 className="font-display text-[clamp(2rem,6vw,3.5rem)] lg:text-6xl font-bold text-brand-gradient">
                      {c.name}
                    </h3>
                    <p className="mt-4 text-[clamp(0.75rem,3vw,1rem)] uppercase tracking-[0.3em] text-primary-glow font-bold">
                      {t(`liga.items.${c.name}.role`)}
                    </p>
                    <p className="mt-8 whitespace-pre-line text-[clamp(1rem,4vw,1.25rem)] lg:text-2xl text-muted-foreground leading-relaxed font-light">
                      {t(`liga.items.${c.name}.desc`)}
                    </p>
                    <p className="mt-6 text-sm md:text-base font-light tracking-wide text-muted-foreground/70">
                      <span className="font-medium text-primary-glow/80">{t("liga.representsLabel")}</span>{" "}
                      {t(`liga.items.${c.name}.represents`)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-12 flex items-center justify-center md:justify-start gap-6">
                <div className="hidden md:flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={t("liga.prev")}
                    className="w-12 h-12 rounded-full grid place-items-center border border-border/70 bg-card/50 text-muted-foreground transition-all duration-300 md:hover:text-primary-glow md:hover:border-primary/60 md:hover:-translate-x-1"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={t("liga.next")}
                    className="w-12 h-12 rounded-full grid place-items-center border border-border/70 bg-card/50 text-muted-foreground transition-all duration-300 md:hover:text-primary-glow md:hover:border-primary/60 md:hover:translate-x-1"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {characters.map((item, i) => (
                    <button
                      key={item.name}
                      type="button"
                      aria-label={`${t("liga.view")} ${item.name}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => {
                        const newDirection = i > index ? 1 : -1;

                        setIndex([i, newDirection]);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Liga;

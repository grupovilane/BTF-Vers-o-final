import { memo } from "react";
import { useTranslation } from "react-i18next";
import monsanto from "@/assets/logos/monsanto.webp";
import claro from "@/assets/logos/claro.webp";
import cruzeirodosul from "@/assets/logos/cruzeirodosul.webp";
import deloitte from "@/assets/logos/deloitte.webp";
import globant from "@/assets/logos/globant.webp";
import prudential from "@/assets/logos/prudential.webp";
import americanas from "@/assets/logos/americanas.webp";
import nttdata from "@/assets/logos/nttdata.webp";
import provider from "@/assets/logos/provider.webp";
import ibm from "@/assets/logos/ibm.webp";
import mapfre from "@/assets/logos/mapfre.webp";
import bancopan from "@/assets/logos/bancopan.webp";
import accenture from "@/assets/logos/accenture.webp";
import bv from "@/assets/logos/bv.webp";
import santander from "@/assets/logos/santander.webp";
import latam from "@/assets/logos/latam.webp";
import telefonica from "@/assets/logos/telefonica.webp";
import accor from "@/assets/logos/Logo_Accor.webp";
import bayer from "@/assets/logos/Logo_Bayer.webp";
import cielo from "@/assets/logos/Logo_of_Cielo.webp";
import vivo from "@/assets/logos/Logo_VIVO.webp";
import syngenta from "@/assets/logos/Syngenta_Logo.webp";
import SectionHeader from "@/components/landing/SectionHeader";

const clients = [
  { name: "Monsanto", src: monsanto },
  { name: "Claro", src: claro },
  { name: "Universidade Cruzeiro do Sul", src: cruzeirodosul },
  { name: "Deloitte", src: deloitte },
  { name: "Globant", src: globant },
  { name: "Prudential", src: prudential },
  { name: "Lojas Americanas", src: americanas },
  { name: "NTT DATA", src: nttdata },
  { name: "Provider", src: provider },
  { name: "IBM", src: ibm },
  { name: "Mapfre", src: mapfre },
  { name: "Banco Pan", src: bancopan },
  { name: "Accenture", src: accenture },
  { name: "Banco BV", src: bv },
  { name: "Santander", src: santander },
  { name: "LATAM", src: latam },
  { name: "Telefónica", src: telefonica },
  { name: "Accor", src: accor },
  { name: "Bayer", src: bayer },
  { name: "Cielo", src: cielo },
  { name: "Vivo", src: vivo },
  { name: "Syngenta", src: syngenta },
];

// Optical calibration, logo by logo: measured from each file's real artwork
// bounding box + ink coverage, so every brand renders with the same perceived
// mass (not the same pixel height). Values are multipliers of the band unit
// height (--logo-u), keeping the ratio identical across all breakpoints.
const optical: Record<string, { h: number; w: number }> = {
  Monsanto: { h: 0.85, w: 0.61 },
  Claro: { h: 2.44, w: 2.0 },
  "Universidade Cruzeiro do Sul": { h: 2.91, w: 2.8 },
  Deloitte: { h: 3.38, w: 2.48 },
  Globant: { h: 2.97, w: 2.64 },
  Prudential: { h: 1.47, w: 1.28 },
  "Lojas Americanas": { h: 2.94, w: 2.71 },
  "NTT DATA": { h: 3.57, w: 2.73 },
  Provider: { h: 3.51, w: 3.3 },
  IBM: { h: 2.18, w: 1.92 },
  Mapfre: { h: 4.38, w: 3.02 },
  "Banco Pan": { h: 1.51, w: 1.75 },
  Accenture: { h: 1.43, w: 2.49 },
  "Banco BV": { h: 0.85, w: 1.22 },
  Santander: { h: 0.53, w: 3.01 },
  LATAM: { h: 2.36, w: 2.73 },
  "Telefónica": { h: 2.68, w: 2.68 },
  Accor: { h: 1.31, w: 1.2 },
  Bayer: { h: 0.98, w: 0.98 },
  Cielo: { h: 0.68, w: 2.03 },
  Vivo: { h: 0.67, w: 2.13 },
  Syngenta: { h: 0.78, w: 2.25 },
};

const Clients = () => {
  const { t } = useTranslation();
  return (
    <section className="py-12 border-b border-border/60 overflow-hidden">
      <SectionHeader
        align="center"
        className="mb-8 px-6"
        title={t("clients.title")}
        titleClassName="text-[13px] sm:text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      />
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div
          className="flex items-center justify-center w-max animate-marquee [--logo-u:38.4px] md:[--logo-u:48px]"
          style={{ gap: "clamp(2rem, 5vw, 4rem)" }}
        >
          {[...clients, ...clients].map((c, i) => {
            const o = optical[c.name] ?? { h: 1, w: 1 };
            return (
              <div
                key={`${c.name}-${i}`}
                className="shrink-0 flex items-center justify-center h-[calc(var(--logo-u)*1.2)]"
                style={{ width: `calc(var(--logo-u) * ${o.w})` }}
              >
                <img
                  src={c.src}
                  alt={`Logo ${c.name}`}
                  className="w-auto max-w-none object-contain object-center grayscale brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                  style={{ height: `calc(var(--logo-u) * ${o.h})` }}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(Clients);

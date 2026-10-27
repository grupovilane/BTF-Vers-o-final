import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/landing/SectionHeader";

const FAQ = () => {
  const { t } = useTranslation();

  const faqs = t("faq.items", { returnObjects: true }) as { q: string; a: string }[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="py-10 md:py-14 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container mx-auto px-6">
        <SectionHeader className="mb-14" label={t("faq.tag")} title={t("faq.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")} />

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="rounded-2xl border border-border/60 bg-gradient-card px-6"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold leading-snug hover:no-underline [&>svg]:h-3.5 [&>svg]:w-3.5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default memo(FAQ);

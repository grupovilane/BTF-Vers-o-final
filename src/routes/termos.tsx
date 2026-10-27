import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import LegalLayout from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | BTF. Blue Trust Force" },
      { name: "description", content: "Condições de uso do site da BTF. Blue Trust Force: propriedade intelectual, responsabilidades e regras de utilização do conteúdo." },
      { property: "og:title", content: "Termos de Uso | BTF. Blue Trust Force" },
      { property: "og:description", content: "Condições de uso do site da BTF. Blue Trust Force: propriedade intelectual, responsabilidades e regras de utilização do conteúdo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  const { t } = useTranslation();
  return (
    <LegalLayout
      title={t("legal.terms.title")}
      updatedAt={t("legal.updatedAt")}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: t("legal.terms.body"),
        }}
      />
    </LegalLayout>
  );
}

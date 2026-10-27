import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import LegalLayout from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | BTF. Blue Trust Force" },
      { name: "description", content: "Como a BTF. Blue Trust Force coleta, usa, armazena e protege dados pessoais, em conformidade com a LGPD (Lei 13.709/2018)." },
      { property: "og:title", content: "Política de Privacidade | BTF. Blue Trust Force" },
      { property: "og:description", content: "Como a BTF. Blue Trust Force coleta, usa, armazena e protege dados pessoais, em conformidade com a LGPD (Lei 13.709/2018)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  const { t } = useTranslation();
  return (
    <LegalLayout
      title={t("legal.privacy.title")}
      updatedAt={t("legal.updatedAt")}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: t("legal.privacy.body"),
        }}
      />
    </LegalLayout>
  );
}

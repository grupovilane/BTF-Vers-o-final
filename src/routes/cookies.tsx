import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import LegalLayout from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies | BTF. Blue Trust Force" },
      { name: "description", content: "Quais cookies o site da BTF utiliza, para que servem e como gerenciar suas preferências de cookies necessários, analíticos e de marketing." },
      { property: "og:title", content: "Política de Cookies | BTF. Blue Trust Force" },
      { property: "og:description", content: "Quais cookies o site da BTF utiliza, para que servem e como gerenciar suas preferências de cookies necessários, analíticos e de marketing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const { t } = useTranslation();
  return (
    <LegalLayout
      title={t("legal.cookies.title")}
      updatedAt={t("legal.updatedAt")}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: t("legal.cookies.body", { version: "1.0" }),
        }}
      />
    </LegalLayout>
  );
}

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { getConsent, setConsent } from "@/lib/consent";

const CookieConsent = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (!stored) setOpen(true);
    else {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }

    const handler = () => {
      const current = getConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setShowPrefs(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-preferences", handler);
    return () => window.removeEventListener("open-cookie-preferences", handler);
  }, []);

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    setConsent(choice);
    setOpen(false);
    setShowPrefs(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("cookies.title")}
      className="fixed bottom-4 inset-x-4 md:left-auto md:right-6 md:max-w-md z-50 p-6 rounded-2xl glass shadow-elegant"
    >
      <h3 className="font-display font-semibold mb-2">{t("cookies.title")}</h3>
      <p className="text-sm text-muted-foreground">{t("cookies.desc")}</p>

      {showPrefs && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t("cookies.necessary")}</p>
              <p className="text-xs text-muted-foreground">{t("cookies.necessaryDesc")}</p>
            </div>
            <Switch checked disabled aria-label={t("cookies.necessary")} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t("cookies.analytics")}</p>
              <p className="text-xs text-muted-foreground">{t("cookies.analyticsDesc")}</p>
            </div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label={t("cookies.analytics")} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t("cookies.marketing")}</p>
              <p className="text-xs text-muted-foreground">{t("cookies.marketingDesc")}</p>
            </div>
            <Switch checked={marketing} onCheckedChange={setMarketing} aria-label={t("cookies.marketing")} />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {showPrefs ? (
          <>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => decide({ analytics: false, marketing: false })}>
              {t("cookies.decline")}
            </Button>
            <Button variant="hero" size="sm" className="flex-1" onClick={() => decide({ analytics, marketing })}>
              {t("cookies.save")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowPrefs(true)}>
              {t("cookies.manage")}
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => decide({ analytics: false, marketing: false })}>
              {t("cookies.decline")}
            </Button>
            <Button variant="hero" size="sm" className="flex-1" onClick={() => decide({ analytics: true, marketing: true })}>
              {t("cookies.accept")}
            </Button>
          </>
        )}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        <Link to="/cookies" className="underline hover:text-primary-glow">
          {t("cookies.policyLink")}
        </Link>
      </p>
    </div>
  );
};

export default CookieConsent;

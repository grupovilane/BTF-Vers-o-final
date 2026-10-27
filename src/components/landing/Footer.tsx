import { useState, useCallback } from "react";
import { Mail, Phone, MapPin, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import vilaneLogo from "@/assets/vilane-logo.webp";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { trackEvent, consentStatus, openCookiePreferences, COOKIE_POLICY_VERSION } from "@/lib/consent";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate({ to: "/", hash: id });
        window.setTimeout(() => scrollToId(id), 300);
      } else {
        window.history.replaceState(null, "", `/#${id}`);
        scrollToId(id);
      }
    },
    [location.pathname, navigate, scrollToId]
  );

  const servicos = t("services.items", { returnObjects: true }) as { title: string }[];

  const legalLinks = [
    { to: "/privacidade", label: t("footer.legalLinks.privacy") },
    { to: "/termos", label: t("footer.legalLinks.terms") },
    { to: "/cookies", label: t("footer.legalLinks.cookies") },
  ];

  const navegacao = [
    { label: t("nav.whoWeAre"), id: "quem-somos" },
    { label: t("nav.liga"), id: "liga" },
    { label: t("nav.services"), id: "servicos" },
    { label: t("nav.events"), id: "eventos" },
    { label: t("nav.careers"), id: "trabalhe-conosco" },
    { label: t("cta.tag"), id: "contato" },
  ];



  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-border/60 grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary-glow mb-3">{t("footer.newsletter.tag")}</p>
            <h3 className="font-display text-2xl font-bold">
              {t("footer.newsletter.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {t("footer.newsletter.desc")}
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              // Guarda de reentrância: evita envio duplo e corrida entre respostas.
              if (isLoading) return;
              if (!optIn) {
                toast.error(t("footer.newsletter.optInError"));
                return;
              }
              setIsLoading(true);


              try {
                const { data, error } = await supabase.functions.invoke('send-lead-to-sheets', {
                  body: {
                    email,
                    type: 'newsletter',
                    consent: true,
                    consentTimestamp: new Date().toISOString(),
                    consentPolicyVersion: COOKIE_POLICY_VERSION,
                  }
                });

                const code = (data as { code?: string } | null)?.code;
                if (error) throw error;
                if (code) {
                  toast.error(t(`errors.${code}`, { defaultValue: t("cta.error") }));
                  return;
                }

                // Nenhum dado pessoal é enviado ao dataLayer.
                trackEvent({
                  event: "newsletter_subscribe",
                  source: "landing_btf",
                  form_type: "newsletter",
                  consent_status: consentStatus(),
                });

                setEmail("");
                setOptIn(false);
                toast.success(t("footer.newsletter.success"));
              } catch (error) {
                console.error('Newsletter error:', error);
                toast.error(t("cta.error"));
              } finally {
                setIsLoading(false);
              }
            }}
            className="flex flex-col gap-3 md:items-end"
          >
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end w-full">
              <input
                type="email"
                id="newsletter-email"
                name="newsletter-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.newsletter.placeholder")}
                aria-label={t("footer.newsletter.placeholder")}
                autoComplete="email"
                className="w-full sm:w-72 rounded-lg bg-secondary/60 border border-border px-4 py-3 text-sm outline-none transition-colors focus:border-primary/70"
              />
              <button
                type="submit"
                disabled={isLoading || !optIn}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-50"
              >
                {t("footer.newsletter.button")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-start gap-3 md:max-w-md">
              <Checkbox
                id="newsletter-optin"
                checked={optIn}
                onCheckedChange={(v) => setOptIn(v === true)}
                aria-required="true"
                className="mt-0.5"
              />
              <label htmlFor="newsletter-optin" className="text-[11px] leading-snug text-muted-foreground cursor-pointer">
                {t("footer.newsletter.optIn")}{" "}
                <Link to="/privacidade" className="underline hover:text-primary-glow">
                  {t("footer.legalLinks.privacy")}
                </Link>
              </label>
            </div>
          </form>

        </div>

        {/* Colunas */}
        <div className="py-12 grid gap-10 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {t("footer.about")}
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("footer.followUs")}</p>
            <div className="mt-3 flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => {
                const isLinkedIn = label === "LinkedIn";
                const isInstagram = label === "Instagram";
                return (
                  <a
                    key={label}
                    href={isLinkedIn ? "https://www.linkedin.com/company/bluetrustforce/" : isInstagram ? "https://www.instagram.com/bluetrustforceit/" : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full grid place-items-center border border-border/70 bg-secondary/40 text-muted-foreground transition-all duration-300 hover:text-primary-glow hover:border-primary/60"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t("footer.links")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {servicos.map((s) => (
                <li key={s.title}>
                  <a
                    href="/#servicos"
                    onClick={(e) => goToSection(e, "servicos")}
                    className="transition-colors hover:text-primary-glow"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t("footer.nav")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navegacao.map((n) => (
                <li key={n.label}>
                  <a
                    href={`/#${n.id}`}
                    onClick={(e) => goToSection(e, n.id)}
                    className="transition-colors hover:text-primary-glow"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-primary-glow">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="transition-colors hover:text-primary-glow text-left"
                >
                  {t("footer.manageCookies")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-glow shrink-0" />
                <a href="tel:+5511944983629" className="hover:text-primary-glow">+55 (11) 94498-3629</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-glow shrink-0" />
                <a href="mailto:contato@bluetrustforce.com.br" className="hover:text-primary-glow">
                  contato@bluetrustforce.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-foreground text-xs uppercase tracking-wider">{t("footer.hq")}</strong>
                  Rua Jurubatuba, 1350 - Centro, São Bernardo do Campo - SP, 09725-000
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-foreground text-xs uppercase tracking-wider">{t("footer.branch")}</strong>
                  Avenida Paulista, 1636 - Cerqueira César, São Paulo - SP, 01310-200
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <span>{t("footer.compliance")}</span>
          <span className="flex items-center gap-1.5">
            <img src={vilaneLogo} alt="" aria-hidden="true" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain opacity-80" />
            {t("footer.developedBy")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

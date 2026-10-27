import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, consentStatus, COOKIE_POLICY_VERSION } from "@/lib/consent";
import SectionHeader from "@/components/landing/SectionHeader";

const services = [
  "cta.services.arch",
  "cta.services.auto",
  "cta.services.consult",
  "cta.services.cyber",
  "cta.services.int",
  "cta.services.sales",
  "cta.services.security",
  "cta.services.others",
];

const CTA = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);


  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setEmailError("");
    } else if (!emailRegex.test(val)) {
      setEmailError(t("cta.form.email_error"));
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (val: string) => {
    const phoneRegex = /^\+?[\d\s\-()]{8,20}$/;
    if (!val) {
      setPhoneError("");
    } else if (!phoneRegex.test(val)) {
      setPhoneError(t("cta.form.phone_error"));
    } else {
      setPhoneError("");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (loading || sent) return;

    if (emailError || phoneError) {
      toast.error(t("cta.error"));
      return;
    }

    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries()) as Record<string, string>;
    const message = formDataObj['message'] || '';

    if (message.length < 20) {
      toast.error(t("cta.form.message_error"));
      return;
    }

    if (!consentGiven) {
      toast.error(t("cta.form.consent_error"));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-lead-to-sheets', {
        body: {
          ...formDataObj,
          consent: true,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: COOKIE_POLICY_VERSION,
        }
      });

      const code = (data as { code?: string } | null)?.code;
      if (error || code) {
        toast.error(code ? t(`errors.${code}`, { defaultValue: t("cta.error") }) : t("cta.error"));
        return;
      }

      // Somente dados não identificáveis são enviados ao dataLayer.
      trackEvent({
        event: "lead_submit",
        source: "landing_btf",
        form_type: "diagnostico",
        service_selected: formDataObj['service'] || "nao_informado",
        consent_status: consentStatus(),
      });


      setSent(true);
      toast.success(t("cta.success.toast"));
    } catch (error) {
      console.error('Error sending lead:', error);
      toast.error(t("cta.error"));
    } finally {
      setLoading(false);
    }
  };

  return (

    <section id="contato" className="py-10 md:py-14 relative scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-primary/30 bg-gradient-card p-10 md:p-16 shadow-elegant">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary-glow/20 blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-md">
              <SectionHeader label={t("cta.tag")} title={t("cta.title", { interpolation: { escapeValue: false } }).replace(/<\/?0>/g, "")} description={t("cta.desc")} />
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {(t("cta.benefits", { returnObjects: true }) as string[]).map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-glow" /> {i}
                  </li>
                ))}
              </ul>
            </div>


            {sent ? (
              <div className="p-8 rounded-2xl glass text-center">
                <CheckCircle2 className="w-12 h-12 text-primary-glow mx-auto mb-4" />
                <h3 className="font-display font-semibold text-xl mb-2">{t("cta.success.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("cta.success.desc")}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="w-full max-w-full box-border space-y-3 p-6 rounded-2xl glass">
                <Input required id="cta-name" name="name" placeholder={t("cta.form.name")} aria-label={t("cta.form.name")} autoComplete="name" className="h-12 bg-background/60" />
                <div className="relative">
                  <Input 
                    required 
                    type="email" 
                    id="cta-email"
                    name="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    placeholder={t("cta.form.email")}
                    aria-label={t("cta.form.email")}
                    autoComplete="email"
                    className={`h-12 bg-background/60 ${emailError ? 'border-red-500 ring-red-500' : ''}`} 
                  />
                  {emailError && (
                    <div className="absolute left-0 -top-8 bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1">
                      {emailError}
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 rotate-45" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    required 
                    id="cta-phone"
                    name="phone" 
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      validatePhone(e.target.value);
                    }}
                    placeholder={t("cta.form.phone")}
                    aria-label={t("cta.form.phone")}
                    autoComplete="tel"
                    className={`h-12 bg-background/60 ${phoneError ? 'border-red-500 ring-red-500' : ''}`} 
                  />
                  {phoneError && (
                    <div className="absolute left-0 -top-8 bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1">
                      {phoneError}
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 rotate-45" />
                    </div>
                  )}
                </div>
                <Input required id="cta-company" name="company" placeholder={t("cta.form.company")} aria-label={t("cta.form.company")} autoComplete="organization" className="h-12 bg-background/60" />
                <Input id="cta-role" name="role" placeholder={t("cta.form.role")} aria-label={t("cta.form.role")} autoComplete="organization-title" className="h-12 bg-background/60" />
                <Select name="service">
                  <SelectTrigger id="cta-service" aria-label={t("cta.form.service")} className="h-12 bg-background/60">
                    <SelectValue placeholder={t("cta.form.service")} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s} value={t(s)}>{t(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>
                  <Textarea
                    id="cta-message"
                    name="message"
                    value={message}
                    maxLength={1000}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("cta.form.message")}
                    aria-label={t("cta.form.message")}
                    className="min-h-28 bg-background/60"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground flex justify-between items-center px-1">
                    <span>{t("cta.form.message_hint")}</span>
                    <span>{message.length}/1000</span>
                  </p>
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    id="cta-consent"
                    checked={consentGiven}
                    onCheckedChange={(v) => setConsentGiven(v === true)}
                    aria-required="true"
                    className="mt-0.5"
                  />
                  <label htmlFor="cta-consent" className="text-[11px] leading-snug text-muted-foreground cursor-pointer">
                    {t("cta.form.consent")}{" "}
                    <Link to="/privacidade" className="underline hover:text-primary-glow">
                      {t("cta.form.privacyLink")}
                    </Link>
                  </label>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading || !consentGiven}>
                  {loading ? t("cta.form.sending") : t("cta.form.submit")} {!loading && <ArrowRight />}
                </Button>

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
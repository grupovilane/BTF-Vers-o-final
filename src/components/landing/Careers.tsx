import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Loader2, Paperclip, Rocket, Send, TrendingUp, Upload, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, COOKIE_POLICY_VERSION } from "@/lib/consent";
import careersTeam from "@/assets/careers-team.webp";

const MAX_BYTES = 5 * 1024 * 1024;

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read_error"));
    reader.readAsDataURL(file);
  });

type Errors = Partial<Record<
  "fullName" | "email" | "phone" | "desiredRole" | "message" | "portfolioUrl" | "resume" | "consent",
  string | undefined
>>;

const Careers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    desiredRole: "",
    message: "",
    portfolioUrl: "",
    website: "",
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener("open-careers-modal", openModal);
    return () => window.removeEventListener("open-careers-modal", openModal);
  }, []);

  const setValue = (key: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateFile = (candidate: File): string | null => {
    if (!candidate.name.toLowerCase().endsWith(".pdf")) return t("careers.errors.pdfOnly");
    if (candidate.type !== "application/pdf") return t("careers.errors.pdfOnly");
    if (candidate.size > MAX_BYTES) return t("careers.errors.tooLarge");
    if (candidate.size === 0) return t("careers.errors.empty");
    return null;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const candidate = e.target.files?.[0];
    if (!candidate) return;
    const error = validateFile(candidate);
    if (error) {
      setFile(null);
      setErrors((prev) => ({ ...prev, resume: error } as Errors));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(candidate);
    setErrors((prev) => ({ ...prev, resume: undefined } as Errors));
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (values.fullName.trim().length < 2) next.fullName = t("careers.errors.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = t("careers.errors.email");
    if (!/^\+?[\d\s\-()]{8,20}$/.test(values.phone.trim())) next.phone = t("careers.errors.phone");
    if (values.desiredRole.trim().length < 2) next.desiredRole = t("careers.errors.role");
    if (values.message.trim().length < 20) next.message = t("careers.errors.message");
    if (values.portfolioUrl.trim()) {
      try {
        const url = new URL(values.portfolioUrl.trim());
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("protocol");
      } catch {
        next.portfolioUrl = t("careers.errors.url");
      }
    }
    if (!file) next.resume = t("careers.errors.missingFile");
    else {
      const fileError = validateFile(file);
      if (fileError) next.resume = fileError;
    }
    if (!consent) next.consent = t("careers.errors.consent");
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(t("careers.errors.generic"));
      return;
    }

    setLoading(true);
    try {
      const base64 = await fileToBase64(file as File);
      const { data, error } = await supabase.functions.invoke("submit-job-application", {
        body: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          desiredRole: values.desiredRole,
          message: values.message,
          portfolioUrl: values.portfolioUrl || undefined,
          website: values.website,
          consent: true,
          consentAt: new Date().toISOString(),
          privacyPolicyVersion: COOKIE_POLICY_VERSION,
          fileName: (file as File).name,
          fileSize: (file as File).size,
          fileType: (file as File).type,
          fileBase64: base64,
          idempotencyKey: idempotencyKey.current,
        },
      });

      if (error || (data && (data as { error?: string }).error)) {
        throw new Error("submit_failed");
      }

      // Somente dados não identificáveis são enviados ao analytics.
      trackEvent({ event: "job_application_submit", form_type: "careers", status: "success" });

      setSent(true);
      toast.success(t("careers.success.title"));
    } catch {
      toast.error(t("careers.errors.submit"));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      triggerRef.current?.focus();
      if (sent) {
        setSent(false);
        setValues({ fullName: "", email: "", phone: "", desiredRole: "", message: "", portfolioUrl: "", website: "" });
        setConsent(false);
        setFile(null);
        setErrors({});
        idempotencyKey.current = crypto.randomUUID();
      }
    }
  };

  const describedBy = (field: keyof Errors, extra?: string) =>
    [errors[field] ? `careers-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const fieldError = (field: keyof Errors) =>
    errors[field] ? (
      <p id={`careers-${field}-error`} role="alert" className="mt-1 text-xs text-destructive flex items-center gap-1">
        <X className="w-3 h-3" aria-hidden="true" /> {errors[field]}
      </p>
    ) : null;

  const highlights = t("careers.highlights", { returnObjects: true }) as string[];
  const highlightIcons = [Rocket, TrendingUp, Users];

  return (
    <section id="trabalhe-conosco" className="py-10 md:py-14">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto rounded-3xl border border-primary/25 bg-gradient-card shadow-elegant overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-glow">
                {t("careers.tag")}
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight">
                {t("careers.title")}
              </h2>
              <p className="mt-4 text-muted-foreground">{t("careers.desc")}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                {highlights.map((h, i) => {
                  const Icon = highlightIcons[i] ?? Rocket;
                  return (
                    <span key={h} className="flex items-center gap-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4 text-primary-glow shrink-0" aria-hidden="true" />
                        {h}
                      </span>
                      {i < highlights.length - 1 && (
                        <span className="text-border" aria-hidden="true">·</span>
                      )}
                    </span>
                  );
                })}
              </div>

              <Button
                ref={triggerRef}
                variant="hero"
                size="lg"
                className="mt-8 w-full sm:w-auto"
                onClick={() => setOpen(true)}
              >
                <Send aria-hidden="true" /> {t("careers.cta")}
              </Button>

              <p className="mt-4 text-xs text-muted-foreground">{t("careers.uploadNote")}</p>
            </div>

            <div className="relative min-h-[280px] lg:min-h-0">
              <img
                src={careersTeam}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent
          role="dialog"
          aria-modal="true"
          aria-labelledby="careers-modal-title"
          className="w-[95vw] max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            firstFieldRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle id="careers-modal-title" className="font-display text-2xl">
              {t("careers.modal.title")}
            </DialogTitle>
            <DialogDescription>{t("careers.modal.desc")}</DialogDescription>
          </DialogHeader>

          {sent ? (
            <div className="py-8 text-center" role="status" aria-live="polite">
              <FileText className="w-10 h-10 mx-auto text-primary-glow mb-4" aria-hidden="true" />
              <p className="font-display text-lg font-semibold">{t("careers.success.title")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("careers.success.desc")}</p>
              <Button variant="outline" className="mt-6" onClick={() => closeModal(false)}>
                {t("careers.modal.close")}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading} noValidate>
              <input
                type="text"
                name="website"
                value={values.website}
                onChange={(e) => setValue("website", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div>
                <label htmlFor="careers-fullName" className="text-sm font-medium">{t("careers.fields.name")} *</label>
                <Input
                  ref={firstFieldRef}
                  id="careers-fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={values.fullName}
                  onChange={(e) => setValue("fullName", e.target.value)}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={describedBy("fullName")}
                  className="mt-1 h-12 bg-background/60"
                />
                {fieldError("fullName")}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="careers-email" className="text-sm font-medium">{t("careers.fields.email")} *</label>
                  <Input
                    id="careers-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={(e) => setValue("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={describedBy("email")}
                    className="mt-1 h-12 bg-background/60"
                  />
                  {fieldError("email")}
                </div>
                <div>
                  <label htmlFor="careers-phone" className="text-sm font-medium">{t("careers.fields.phone")} *</label>
                  <Input
                    id="careers-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={values.phone}
                    onChange={(e) => setValue("phone", e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={describedBy("phone")}
                    className="mt-1 h-12 bg-background/60"
                  />
                  {fieldError("phone")}
                </div>
              </div>

              <div>
                <label htmlFor="careers-desiredRole" className="text-sm font-medium">{t("careers.fields.role")} *</label>
                <Input
                  id="careers-desiredRole"
                  name="desiredRole"
                  required
                  value={values.desiredRole}
                  onChange={(e) => setValue("desiredRole", e.target.value)}
                  aria-invalid={!!errors.desiredRole}
                  aria-describedby={describedBy("desiredRole")}
                  className="mt-1 h-12 bg-background/60"
                />
                {fieldError("desiredRole")}
              </div>

              <div>
                <label htmlFor="careers-message" className="text-sm font-medium">{t("careers.fields.message")} *</label>
                <Textarea
                  id="careers-message"
                  name="message"
                  required
                  minLength={20}
                  maxLength={2000}
                  value={values.message}
                  onChange={(e) => setValue("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={describedBy("message", "careers-message-hint")}
                  className="mt-1 min-h-28 md:min-h-36 bg-background/60"
                />
                <p id="careers-message-hint" className="mt-1 text-[11px] text-muted-foreground">
                  {t("careers.fields.messageHint")} ({values.message.length}/2000)
                </p>
                {fieldError("message")}
              </div>

              <div>
                <label htmlFor="careers-portfolioUrl" className="text-sm font-medium">{t("careers.fields.portfolio")}</label>
                <Input
                  id="careers-portfolioUrl"
                  name="portfolioUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  value={values.portfolioUrl}
                  onChange={(e) => setValue("portfolioUrl", e.target.value)}
                  aria-invalid={!!errors.portfolioUrl}
                  aria-describedby={describedBy("portfolioUrl")}
                  className="mt-1 h-12 bg-background/60"
                />
                {fieldError("portfolioUrl")}
              </div>

              <div>
                <label htmlFor="careers-resume" className="text-sm font-medium">{t("careers.fields.resume")} *</label>
                <p id="careers-resume-hint" className="mt-1 text-[11px] text-muted-foreground">
                  {t("careers.fields.resumeHint")}
                </p>
                <input
                  ref={fileInputRef}
                  id="careers-resume"
                  name="resume"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={onFileChange}
                  aria-invalid={!!errors.resume}
                  aria-describedby={describedBy("resume", "careers-resume-hint")}
                  className="mt-2 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-primary/40 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-glow hover:file:bg-primary/20 cursor-pointer"
                />
                {file && (
                  <div
                    className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="flex items-center gap-2 text-sm truncate">
                      <Paperclip className="w-4 h-4 text-primary-glow shrink-0" aria-hidden="true" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground shrink-0">({formatSize(file.size)})</span>
                    </span>
                    <span className="flex gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label={t("careers.fields.replaceFile")}
                      >
                        <Upload className="w-4 h-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        aria-label={t("careers.fields.removeFile")}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </span>
                  </div>
                )}
                {fieldError("resume")}
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="careers-consent"
                  checked={consent}
                  onCheckedChange={(v) => {
                    setConsent(v === true);
                    setErrors((prev) => ({ ...prev, consent: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!errors.consent}
                  aria-describedby={describedBy("consent")}
                  className="mt-0.5"
                />
                <label htmlFor="careers-consent" className="text-xs leading-snug text-muted-foreground cursor-pointer">
                  {t("careers.fields.consent")}{" "}
                  <Link to="/privacidade" className="underline hover:text-primary-glow">
                    {t("careers.fields.privacyLink")}
                  </Link>{" "}
                  ·{" "}
                  <a href="/privacidade#recrutamento" className="underline hover:text-primary-glow">
                    {t("careers.fields.recruitmentPrivacyLink")}
                  </a>
                </label>
              </div>
              {fieldError("consent")}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={loading || !consent}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> {t("careers.modal.sending")}
                    </>
                  ) : (
                    t("careers.modal.submit")
                  )}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => closeModal(false)}>
                  {t("careers.modal.close")}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Careers;

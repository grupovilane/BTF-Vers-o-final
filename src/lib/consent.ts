/**
 * Gerenciamento de consentimento (LGPD).
 * Nenhum script de analytics/marketing é carregado antes do consentimento explícito.
 */

export const COOKIE_POLICY_VERSION = "2026-08-25";
const STORAGE_KEY = "btf-consent-v2";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = ConsentCategories & {
  timestamp: string;
  policyVersion: string;
};

type Listener = (record: ConsentRecord | null) => void;
const listeners = new Set<Listener>();

export function getConsent(): ConsentRecord | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.policyVersion !== COOKIE_POLICY_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function consentStatus(): "granted" | "denied" | "partial" | "unset" {
  const c = getConsent();
  if (!c) return "unset";
  if (c.analytics && c.marketing) return "granted";
  if (!c.analytics && !c.marketing) return "denied";
  return "partial";
}

export function setConsent(choice: { analytics: boolean; marketing: boolean }) {
  const record: ConsentRecord = {
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    timestamp: new Date().toISOString(),
    policyVersion: COOKIE_POLICY_VERSION,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }
  applyConsent(record);
  listeners.forEach((l) => l(record));
  return record;
}

export function subscribeConsent(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }
}

/**
 * Nenhuma tag de analytics/marketing é carregada no site.
 * Mantido como no-op para preservar a API de consentimento e os pontos de chamada.
 */
export function trackEvent(_payload: Record<string, string | number | boolean>) {
  return;
}

export function applyConsent(_record: ConsentRecord | null) {
  return;
}

/** Chamado no boot do app: nenhuma tag de terceiros é carregada. */
export function initConsent() {
  return;
}

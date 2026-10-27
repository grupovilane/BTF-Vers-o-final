import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

/**
 * Core Web Vitals (LCP, CLS, INP — INP substituiu o FID em 2024),
 * medidos em campo a cada carregamento, inclusive após cada deploy.
 *
 * Os valores ficam disponíveis em:
 *  - console (apenas em dev ou com ?debug_vitals=1)
 *  - window.__BTF_VITALS__ (snapshot para auditoria/Playwright)
 *  - dataLayer, somente se o usuário consentiu com analytics (LGPD)
 */

export type VitalsSnapshot = Record<string, { value: number; rating: string; id: string }>;

declare global {
  interface Window {
    __BTF_VITALS__?: VitalsSnapshot;
    dataLayer?: Record<string, unknown>[];
  }
}

const BUILD_ID = import.meta.env['VITE_BUILD_ID'] ?? "dev";

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem("btf-consent-v2");
    return raw ? JSON.parse(raw)?.analytics === true : false;
  } catch {
    return false;
  }
}

function report(metric: Metric) {
  const debug =
    import.meta.env.DEV ||
    new URLSearchParams(window.location.search).has("debug_vitals");

  const value = Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value) / (metric.name === "CLS" ? 1000 : 1);

  window.__BTF_VITALS__ = {
    ...(window.__BTF_VITALS__ ?? {}),
    [metric.name]: { value, rating: metric.rating, id: metric.id },
  };

  if (debug) {
    // eslint-disable-next-line no-console
    console.info(`[web-vitals] ${metric.name}: ${value} (${metric.rating}) build=${BUILD_ID}`);
  }

  if (hasAnalyticsConsent() && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "web_vitals",
      metric_name: metric.name,
      metric_value: value,
      metric_rating: metric.rating,
      metric_id: metric.id,
      build_id: BUILD_ID,
      page_path: window.location.pathname,
    });
  }
}

export function initVitals() {
  onLCP(report);
  onCLS(report);
  onINP(report);
  onFCP(report);
  onTTFB(report);
}

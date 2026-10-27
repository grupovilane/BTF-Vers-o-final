import { useEffect } from "react";

const SITE_URL = "https://btf-innovation-hub.lovable.app";

type Meta = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function usePageMeta({ title, description, path, noindex }: Meta) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;

    setTag('meta[name="description"]', () => Object.assign(document.createElement("meta"), { name: "description" }), "content", description);
    setTag('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", url);
    setTag('meta[property="og:title"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:title"); return m; }, "content", title);
    setTag('meta[property="og:description"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:description"); return m; }, "content", description);
    setTag('meta[property="og:url"]', () => { const m = document.createElement("meta"); m.setAttribute("property", "og:url"); return m; }, "content", url);
    setTag('meta[name="twitter:title"]', () => Object.assign(document.createElement("meta"), { name: "twitter:title" }), "content", title);
    setTag('meta[name="twitter:description"]', () => Object.assign(document.createElement("meta"), { name: "twitter:description" }), "content", description);

    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      setTag('meta[name="robots"]', () => Object.assign(document.createElement("meta"), { name: "robots" }), "content", "noindex,follow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, path, noindex]);
}

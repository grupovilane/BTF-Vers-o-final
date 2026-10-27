import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "btf_chunk_reloaded";

/**
 * Lazy import resiliente a chunks obsoletos (deploy novo com hashes diferentes).
 * Tenta novamente uma vez; se ainda falhar, recarrega a página uma única vez.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      window.sessionStorage?.removeItem(RELOAD_KEY);
      return mod;
    } catch (error) {
      try {
        return await factory();
      } catch {
        const alreadyReloaded = window.sessionStorage?.getItem(RELOAD_KEY);
        if (!alreadyReloaded) {
          window.sessionStorage?.setItem(RELOAD_KEY, "1");
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
        throw error;
      }
    }
  });
}

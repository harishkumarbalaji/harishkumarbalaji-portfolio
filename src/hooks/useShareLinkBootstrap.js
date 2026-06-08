import { useEffect } from 'react';
import { parseShareHash, setShareRegistry } from '../utils/shareLink';

const NAV_EVENT = 'portfolio-share-navigate';

/**
 * Loads share registry from portfolioData.json, then dispatches navigation on load/hash change.
 */
export function useShareLinkBootstrap() {
  useEffect(() => {
    let cancelled = false;

    const dispatchFromHash = () => {
      const parsed = parseShareHash();
      if (!parsed) return;
      window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: parsed }));
    };

    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setShareRegistry(data);
        dispatchFromHash();
      })
      .catch((err) => {
        console.error('[shareLink] Failed to load share registry:', err);
        dispatchFromHash();
      });

    window.addEventListener('hashchange', dispatchFromHash);
    return () => {
      cancelled = true;
      window.removeEventListener('hashchange', dispatchFromHash);
    };
  }, []);
}

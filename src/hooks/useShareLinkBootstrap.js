import { useEffect } from 'react';
import { parseShareHash } from '../utils/shareLink';

const NAV_EVENT = 'portfolio-share-navigate';

/**
 * Dispatches share-navigation when the page loads or the hash changes.
 */
export function useShareLinkBootstrap() {
  useEffect(() => {
    const dispatchFromHash = () => {
      const parsed = parseShareHash();
      if (!parsed) return;
      window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: parsed }));
    };

    dispatchFromHash();
    window.addEventListener('hashchange', dispatchFromHash);
    return () => window.removeEventListener('hashchange', dispatchFromHash);
  }, []);
}
